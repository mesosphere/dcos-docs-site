---
layout: layout.pug
navigationTitle:  Using GPUs
title: Using GPUs
menuWeight: 110
excerpt: Adding Graphics Processing Units to your long-running DC/OS services
render: mustache
model: /mesosphere/dcos/1.13/data.yml
enterprise: false
---

DC/OS supports allocating GPUs (Graphics Processing Units) to your long-running DC/OS services. Adding GPUs to your services can dramatically accelerate big data workloads. With GPU-based scheduling, you can share cluster resources for traditional and machine learning workloads, as well as dynamically allocate GPU resources inside those clusters and free them when needed. You can reserve GPU resources for the workloads that need them, or pool these GPU-enabled resources with the rest of the infrastructure for higher overall utilization. After installing DC/OS with GPUs enabled, you can specify GPUs in your application definitions with the `gpus` parameter.

# Installing DC/OS with GPUs Enabled
GPUs must be enabled during DC/OS installation. Follow the instructions below to enable GPUs based on your specific DC/OS deployment method.

## On-Prem DC/OS Installation with GPUs

1.  Install the [NVIDIA Management Library (NVML)](https://developer.nvidia.com/nvidia-management-library-nvml) on each node of your cluster that has GPUs. The minimum required NVIDIA driver version is 340.29. For detailed installation instructions, see the [Mesos GPU support documentation](http://mesos.apache.org/documentation/latest/gpu-support/#external-dependencies).
1.  Install DC/OS using the [custom advanced installation instructions](/mesosphere/dcos/1.13/installing/production/advanced-configuration/). Here are the GPU-specific configuration parameters:

    -  **enable_gpu_isolation**: Indicates whether to enable GPU support in DC/OS. By default, this is set to `enable_gpu_isolation: 'true'`.
    -  **gpus_are_scarce**: Indicates whether to treat GPUs as a scarce resource in the cluster. By default, this is set to `gpus_are_scarce: 'true'`, which means DC/OS reserves GPU nodes exclusively for services that are configured to consume GPU resources. It is important to note that this setting will influence which agent nodes of a GPU-aware framework will be deployed on DC/OS. This setting does not influence the individual tasks which the frameworks might launch while the framework is running. It is possible for a framework to schedule a non-GPU task on an agent node where GPU's are present.
    -  **marathon_gpu_scheduling_behavior**: Indicates whether Marathon will schedule non-GPU tasks on nodes with an available GPU. Default is `restricted`.
    -  **metronome_gpu_scheduling_behavior**: Indicates whether Metronome will schedule non-GPU tasks on nodes with an available GPU. Default is `restricted`.

    For more information, see the [configuration parameter documentation](/mesosphere/dcos/1.13/installing/production/advanced-configuration/configuring-gpu-nodes/) and Mesos [Nvidia GPU Support documentation](http://mesos.apache.org/documentation/latest/gpu-support/#external-dependencies).

## Cloud DC/OS Installation with GPUs using the DC/OS Universal Installer

###  Prerequisites

- Review the [prerequisites](/mesosphere/dcos/1.13/installing/evaluation/) of the DC/OS Universal Installer.
- Review the prerequisites of your cloud provider, such as [AWS](/mesosphere/dcos/1.13/installing/evaluation/aws/#prerequisites), [Azure](/mesosphere/dcos/1.13/installing/evaluation/azure/#prerequisites), or [GCP](/mesosphere/dcos/1.13/installing/evaluation/gcp/#prerequisites).

### Customize your main.tf

In the main.tf file you are using to deploy DC/OS, ensure at least one agent is being deployed with one or more GPUs. Also ensure the agent meets all other [agent node requirements](/mesosphere/dcos/1.13/installing/production/system-requirements/#agent-node-requirements).

For example, on AWS you can set `private_agents_instance_type` to any GPU-enabled instance type that is available in your region:

```
private_agents_instance_type = "p2.xlarge"
```

Then proceed with the installation as normal. The DC/OS Universal Installer will detect if NVIDIA GPUs are present on an agent and install the required software automatically.

# Using GPUs in Your Apps

You can specify GPUs in your application definitions with the `gpus` parameter.

-  You can only specify whole numbers of GPUs in your application definition. If a fractional amount is selected, launching the task will result in a `TASK_ERROR`.
-  NVIDIA GPU support is only available for tasks launched using the [DC/OS Universal Container Runtime](/mesosphere/dcos/1.13/deploying-services/containerizers/). Docker is not supported.

# Examples

## Simple GPU Application Definition
In this example, a simple sleep app is defined which uses GPUs.

1.  Create an an app definition named `simple-gpu-test.json`.

    ```json
    {
         "id": "simple-gpu-test",
         "acceptedResourceRoles":["slave_public", "*"],
         "cmd": "while [ true ] ; do nvidia-smi; sleep 5; done",
         "cpus": 1,
         "mem": 128,
         "disk": 0,
         "gpus": 1,
         "instances": 1
    }
    ```

1.  Launch your app using the DC/OS CLI:

    ```bash
    dcos marathon app add simple-gpu-test.json
    ```

1. After your service has deployed, check the contents of `stdout` to verify that the service is producing the proper output from the `nvidia-smi` command. You should see something like the following, repeated once every 5 seconds. Access the log [via the DC/OS CLI](/mesosphere/dcos/1.13/monitoring/logging/quickstart/) or from the **Health** page for your service on the DC/OS dashboard.

    ```bash
    +------------------------------------------------------+
    | NVIDIA-SMI 352.79     Driver Version: 352.79         |
    |-------------------------------+----------------------+----------------------+
    | GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
    | Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
    |===============================+======================+======================|
    |   0  Tesla M60           Off  | 0000:04:00.0     Off |                    0 |
    | N/A   34C    P0    39W / 150W |     34MiB /  7679MiB |      0%      Default |
    +-------------------------------+----------------------+----------------------+
    ```

You will also see an entry for **GPU** in the DC/OS GUI on the **Configuration** tab for your service.

## Docker-Based Application Definition
In this example, an app is deployed with GPUs that specifies a Docker container and the [DC/OS Universal Container Runtime (UCR)](/mesosphere/dcos/1.13/deploying-services/containerizers/) (container type to `MESOS`).

1.  Create an app definition named `docker-gpu-test.json`.

    ```json
    {
        "id": "docker-gpu-test",
        "acceptedResourceRoles":["slave_public", "*"],
        "cmd": "while [ true ] ; do nvidia-smi; sleep 5; done",
        "cpus": 1,
        "mem": 128,
        "disk": 0,
        "gpus": 1,
        "instances": 1,
        "container": {
          "type": "MESOS",
          "docker": {
            "image": "nvidia/cuda"
          }
        }
    }
    ```

1.  Launch your app using the DC/OS CLI:

    ```bash
    dcos marathon app add docker-gpu-test.json
    ```

1. After your service has deployed, check the contents of `stdout` to verify that the service is producing the proper output from the `nvidia-smi` command. You should see something like the following, repeated once every 5 seconds. Access the log [via the DC/OS CLI](/mesosphere/dcos/1.13/monitoring/logging/quickstart/) or from the **Health** page for your service on the DC/OS dashboard.


You will also see an entry for **GPU** on the **Configuration** tab of the page for your service.

## Learn More about GPUs

- [What is GPU Computing?](http://www.nvidia.com/object/what-is-gpu-computing.html)
- [Mesos NVIDIA GPU Support](https://github.com/apache/mesos/blob/master/docs/gpu-support.md).
- [Tutorial: Deep learning with TensorFlow, Nvidia and Apache Mesos (DC/OS)](https://dcos.io/blog/2017/tutorial-deep-learning-with-tensorflow-nvidia-and-apache-mesos-dc-os-part-1/index.html).
- Presentation: [Supporting GPUs in Docker Containers on Apache Mesos](https://docs.google.com/presentation/d/1FnuEW2ic5d-cpSyVOUMfUSM7WxJlZtTAAWt2dZXJ52A/edit#slide=id.p).
- Presentation: [GPU Support in Apache Mesos](https://www.youtube.com/watch?v=giJ4GXFoeuA).
- Presentation: [Adding GPU Support to Mesos](https://docs.google.com/presentation/d/1Y1IUlWV6g1HzD1wYIYXy6AmbfnczWfjvvmqqpeDFBic/edit#slide=id.p).
