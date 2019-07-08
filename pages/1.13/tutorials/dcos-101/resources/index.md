---
layout: layout.pug
navigationTitle: Allocate and scale resources
title: Allocate and scale resources
excerpt: Provides strategies and examples for scaling resources allocated for deployed applications (part 9)
menuWeight: 9
render: mustache
model: /1.13/data.yml
---
To this point, you have seen how to create a cluster and how to deploy and test applications and services that run on the cluster. You’ve worked with single commands and apps that run in Docker and DC/OS UCR containers. With this tutorial, you will see some of the key benefits provider by container orchestration and perform a few common resource scaling tasks.

# Orchestration and cluster management
Container orchestration plays a key role in cluster management. Container orchestration helps you manage the lifecycle for apps deployed on the cluster by providing features that address important requirements, such as resilient operation, resource allocation, and service management.

## Cluster resiliency
Container orchestration helps ensure resilient operation by:
- Determining the appropriate location for the initial placement of containers based on the current state, size, and configuration of the cluster.
- Supporting distributed processing and scaling to optimize performance, fault-tolerance, and high availability.
- Providing self-contained health monitoring and self-healing operations to resurrect failed containers or agents so activity can continue without disruption.
- Simplifying the deployment of software upgrades or downgrades.

## Resource allocation and usage
Container orchestration improves your ability to manage resources allocation and monitor resource consumption by making sure containers get the specific resources they need to run, including:
- Memory
- CPU
- Disk
- GPU
- Volumes
- Ports
- IP addresses
- Images and artifacts

## Service identification and management
In combination with other features, container orchestration helps you to organize, distribute, and monitor the services you deploy. For example, you can:
- Add labels to services to create metadata for querying and organizing services.
- Use groups or namespaces to define a hierarchy of services and the relationships between them, including dependencies.
- Monitor health and readiness to ensure applications are available and running properly.

This tutorial focuses on **resource management** and **resource isolation** between tasks. These two activities are core functions of any operating system and are central elements of effective cluster administration. In this tutorial, you will learn how to monitor resource usage, how resource limits are enforced, and how to debug resource management issues. For information about other aspects of container orchestration, see the [Related topics](#related-topics) listed at the end of this tutorial.

# Before you begin
Before starting this tutorial, you should verify the following:
- You have access to a running [DC/OS cluster](../start-here/) with at least at least one master node and three agent nodes.
- You have access to a computer where the [DC/OS CLI](../cli/) is installed.
- You have the sample [dcos-101/app2](../native-app/) application deployed and running in your cluster.

# Learning objectives
By completing this tutorial, you will learn:
- How to add resource placement constraints for apps.
- How to monitor and understand your resource utilization.
- How resource limits are enforced.
- How to debug resource management issues.

# Review the app definition
If you take another look at the [app definition]((https://raw.githubusercontent.com/joerg84/dcos-101/master/app2/app2.json)) for the [app2](https://github.com/joerg84/dcos-101/blob/master/app2/app2.go) sample application, you can see the resources allocated for the app in the `cpus`, `mem`, `disk`, and `gpus` settings. For example:

```json
{
  "id": "/dcos-101/app2",
  "cmd": "chmod u+x app2 && ./app2",
  "args": null,
  "user": null,
  "env": null,
  "instances": 1,
  "cpus": 1,
  "mem": 128,
  "disk": 0,
  "gpus": 0,
  "executor": null,
  "constraints": null,
```

### Resource allocation before scaling
The values for `cpus`, `mem`, `disk`, and `gpus` define the **maximum** for each of these resources that a task can use. Tasks rarely use the maximum resources allocated, but these settings specify an upper limit to what you will allow a task to use.

### Using groups for common resource requirements
You might have noticed that the identifier in the app definitions for both [app1](https://raw.githubusercontent.com/joerg84/dcos-101/master/app1/app1.json) and [app2](https://github.com/joerg84/dcos-101/blob/master/app2/app2.go) is prefixed by `/dcos-101/`. 

This common identifier is used to define the specific **application group** that both sample applications belong to. Application groups allow you to specify and apply configuration details and dependencies to multiple applications at the same time.

# Scale applications
When you need more resources for your application, you can scale resources **horizontally** or **vertically**.

Horizontal scaling involves increasing or decreasing the number of instances of an application. You can scale the instance count in two ways:

- By setting a factor to apply to an entire application group by a factor.
- By setting a specific number of instances for an individual application.

## Scale the application group
Since both `appl` and `app2` sample application share the same application group, you can scale them together.

To see how you can scale up and scale down an entire application group, do the following:

1. Scale the application group up using a scale factor of two by running the following command:

    ```bash
    dcos marathon group scale dcos-101 2
    ```

1. Verify that both sample apps have scaled up by running the following command:

    ```bash
    dcos marathon app list
    ```

1. Scale the application group down again by running the following command:

    ```bash
    dcos marathon group scale dcos-101 0.5
    ```

1. Verify that both apps have scaled down by running the following command:

    ```bash
    dcos marathon app list
    ```

## Set instance count directly
In some cases, you might want to scale a single application independently. To see how you can scale up and scale down an entire application group, do the following:

1. Scale `app2` to three instances by running the following command:

    ```bash
    dcos marathon app update /dcos-101/app2 instances=3
    ```

    The instance updates are applied incrementally to an existing app definition.

1. Verify that `app2` has scaled by running the following command:

    ```bash
    dcos marathon app list
    ```

1. Scale `app2` back to one instance by running the following command:

    ```bash
    dcos marathon app update /dcos-101/app2 instances=1
    ```

1. Verify that `app2` has scaled by running the following command:

    ```bash
    dcos marathon app list
    ```

## Scale allocated resources
Vertical scaling involves increasing or decreasing the resources, such as CPU or memory, that are allocated to an application instance. You should keep in mind that vertical scaling requires restarting the application, which can affect service availability. In a production environment, you should plan for resource scaling and incorporate any changes into your scheduled maintenance periods, if possible.

1. Scale up to two CPUs for the `app2` instance by running the following command:

    ```bash
    dcos marathon app update /dcos-101/app2 cpus=2
    ```

1. Verify that `app2` has scaled by running the following command:

    ```bash
    dcos marathon app list
    ```

1. Scale back down to one CPU for the `app2` instance by running the following command:

    ```bash
    dcos marathon app update /dcos-101/app2 cpus=1
    ```

# Debug resource problems
When you are managing resources for the applications running on the DC/OS cluster, there are a few common issues that you should learn how to identify and address. The next topics cover a few of these cases.

## Not enough resources in the cluster
To simulate this issue, try increasing the number of `app2` instances by running a command similar to the following:
`dcos marathon app update /dcos-101/app2 instances=100`

This example increases the number of instances to 100. If you have a large cluster, you might need to set the number of instances even higher.

### Symptom
After increasing the number of instances, run `dcos marathon app list` or `dcos marathon deployment list` to check that the `scale` deployment is stuck.

```
/dcos-101/app2   128    1    1/100   N/A      scale     True        N/A     chmod u+x app2 && ./app2
```
  
### Cause
The problem here is that there are no matching resources available. For example, there might be resources left for the public agent role, but not for the default role.

### Solution
To resolve this issue, you can add nodes to the cluster or scale the application back to a level at which resources are available. For example, run a command similar to the following:
`dcos marathon app update /dcos-101/app2 --force instances=1`

You must use the `--force` option in this command because the previous deployment is ongoing.

## Not enough resources on a single node
Because each application is started on a single node, task resources must also fit onto a single node. To simulate this issue, try updating the `app2` app to use 10 CPUs by running a command similar to the following:
`dcos marathon app update /dcos-101/app2 cpus=10`

### Symptom
After increasing the number of CPUs, run `dcos marathon app list` or `dcos marathon deployment list` to check that the `restart` deployment is stuck. For example, if you run `dcos marathon deployment list`, you might see:

```
APP             POD  ACTION   PROGRESS  ID                                    
/dcos-101/app1  -    restart    0/1     f257caa6-672b-4a92-8621-27fba79b9c00  
/dcos-101/app2  -    restart    0/1     692cce55-fd2a-482e-8d46-84fbc12a2927  
```

### Cause
The problem here is that there are no resource offers large enough to match the request.

### Solution
To resolve this issue, you can provision larger or scale the application back to a level at which it fits onto the free resources on a single node. For example, run a command similar to the following:
`dcos marathon app update /dcos-101/app2 --force cpus=1`

You must use the `--force` option in this command because the previous deployment is ongoing.

# Insufficient resource allocation or resource isolation
In some cases, you might have an application that attempts to use more resources than it is allocated. This is a common problem with memory consumption in conjunction with JVM-based applications. To simulate this issue, try deploying the sample [out-of-memory app](https://github.com/joerg84/dcos-101/blob/master/oomApp/oomApp.go) by running the following command:
`dcos marathon app add https://raw.githubusercontent.com/joerg84/dcos-101/master/oomApp/oomApp.json`

### Symptom
After deploying the sample app, check the Marathon log to see if it includes Out of Memory errors. Because the kernel is killing the app, the errors are not always visible to DC/OS. To see the problem in this case, you need to determine the Mesos ID for the out-of-memory application task and view the kernel log file on the computer where that task runs. 

1. Open a terminal and secure shell (SSH) session on an agent where the Out of Memory app runs by running a command similar to the following:

    ```bash
    dcos node ssh --master-proxy --mesos-id=99f56b43-c1a7-4858-be19-5fec03fc88de-S1
    ```

1. Check the kernel log by running the following command:

    ```bash
    journalctl -f _TRANSPORT=kernel
    ```

    The log file should include a message similar to the following:

    ```
    Memory cgroup out of memory: Kill process 10106 (oomApp) score 925 or sacrifice child; Killed process 10390 (oomApp) total-vm:3744760kB, anon-rss:60816kB, file-rss:1240kB, shmem-rss:0kB`
    ```

### Cause
In most cases, there are two potential reasons for your application to be using too much memory:

- There are issues in the application code causing the app to use too much memory, for example, because there is a memory leak in the code logic.

- You have allocated too little memory for the application.

### Solution
To resolve these potential issues, check the application code to correct any programming errors such. If the problem is not in the code itself, increase the amount of memory you have allocated for the application.

To complete this tutorial, be sure to remove the out-of-memory application by running the following command:

```bash
dcos marathon app remove /dcoc-101/oom-app
```

# Next steps
In this tutorial, you learned how to view the resources allocated for application tasks and how to scale and debug potential resource issues.

# Related topics
Now that you are practically a pro, you might want to begin exploring more advanced topics and configuration options such as:
- Using application groups and [labels](../../task-labels/)
- Defining [placement constraints](/1.13/deploying-services/marathon-constraints/)
- Deploying applications in [pods](/1.13/deploying-services/pods/)