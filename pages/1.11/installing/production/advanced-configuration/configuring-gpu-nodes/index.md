---
layout: layout.pug
navigationTitle:  Configuring GPU nodes
title: Configuring GPU nodes
menuWeight: 10
excerpt: Adding Graphics Processing Units to long-running DC/OS services
---


DC/OS supports allocating GPUs (Graphics Processing Units) to your long-running DC/OS services. Adding GPUs to your services can dramatically accelerate big data workloads.

With GPU-based scheduling, you can share cluster resources for traditional and machine learning workloads, as well as dynamically allocate GPU resources inside those clusters and free them when needed. You can reserve GPU resources for the workloads that need them, or pool these GPU-enabled resources with the rest of the infrastructure for higher overall utilization.

After installing DC/OS with GPUs enabled, you can specify GPUs in your application definitions with the `gpus` parameter.

# Installing DC/OS with GPUs Enabled
GPUs must be enabled during DC/OS installation. Follow the instructions below to enable GPUs based on your specific DC/OS deployment method.

## Custom DC/OS Installation with GPUs

1.  Install the [NVIDIA Management Library (NVML)](https://developer.nvidia.com/nvidia-management-library-nvml) on each node of your cluster that has GPUs. The minimum required NVIDIA driver version is 340.29. For detailed installation instructions, see the [Mesos GPU support documentation](http://mesos.apache.org/documentation/latest/gpu-support/#external-dependencies).
1.  Install DC/OS using the [custom advanced installation instructions](/1.11/installing/production/deploying-dcos/installation/). Here are the GPU-specific configuration parameters:

    -  **`enable_gpu_isolation`**: Indicates whether to enable GPU support in DC/OS. By default, this is set to `enable_gpu_isolation: 'true'`.
    -  **`gpus_are_scarce`**: Indicates whether to treat GPUs as a scarce resource in the cluster. By default, this is set to `gpus_are_scarce: 'true'`, which means DC/OS reserves GPU nodes exclusively for services that are configured to consume GPU resources. It's important to note that this setting will influence which agent nodes a GPU-aware framework will be deployed on DC/OS. This setting does not influence the individual tasks which the frameworks might launch while the framework is running. It is possible for a framework to schedule a non-GPU task on an agent node where GPU's are present.

    For more information, see the [configuration parameter documentation](/1.11/installing/production/advanced-configuration/configuration-reference/#enable-gpu-isolation) and Mesos [Nvidia GPU Support documentation](http://mesos.apache.org/documentation/latest/gpu-support/#external-dependencies).

## AWS EC2 DC/OS Installation with GPUs

###  Prerequisites
- The AWS DC/OS advanced template [system requirements](/1.11/installing/evaluation/cloud-installation/aws/advanced/).
- The `zen.sh` script copied to your local machine. The script and instructions are [here](/1.11/installing/evaluation/cloud-installation/aws/advanced/).

### Create Dependencies

1. Run the `zen.sh` script to create the Zen template dependencies. These dependencies will be used as input to create your stack in CloudFormation.

```
bash ./zen.sh <stack-name>
```

   <p class="message--important"><strong>IMPORTANT: </strong>You must run the <code>zen.sh</code> script before performing the next steps.</p>

2. Follow the instructions [here](/1.11/installing/evaluation/cloud-installation/aws/advanced/) to create a cluster with advanced AWS templates, using the following GPU-specific configuration.

3. On the **Create Stack** > **Specify Details** page, specify your stack information and click **Next**. Here are the GPU-specific settings.

   - **CustomAMI** - Specify the custom AMI for your region:

      - us-west-2: `ami-d54a2cad`
      - us-east-1: `ami-5f5d1449`
      - ap-southeast-2: `ami-0d50476e`

   - **MasterInstanceType** - Accept the default master instance type (For example, `m3.xlarge`).
   - **PrivateAgentInstanceType** - Specify an [AWS GPU machine type](https://aws.amazon.com/ec2/instance-types/#p2) (For example, `g2.2xlarge`).
   - **PublicAgentInstanceType** - Specify an [AWS GPU machine type](https://aws.amazon.com/ec2/instance-types/#p2) (For example, `g2.2xlarge`).

4. On the **Options** page, accept the defaults and click **Next**. You can choose whether to roll back on failure. By default this option is set to **Yes**.

5. On the **Review** page, check the acknowledgement box, then click **Create**.

   <p class="message--note"><strong>NOTE: </strong>If the <strong>Create New Stack</strong> page is shown, either AWS is still processing your request or you’re looking at a different region. Navigate to the correct region and refresh the page to see your stack.</p>
