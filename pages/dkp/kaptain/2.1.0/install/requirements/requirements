---
layout: layout.pug
navigationTitle: Requirements
title: Requirements
menuWeight: 3
excerpt: Requirement reference values
beta: false
enterprise: false
---

The amount of resources required for your project **depends on the workload** you want to run, you need to consider: 

-   The number, complexity, and size of your training jobs, notebook servers, deployed models, etc.
-   The amount of metadata and log data stored with each run.

To estimate the amount of resources required for your project, it is recommended that you test your specific use case.

To help you in this task, the following table provides an account of the resources required for two common operations: [installing Kaptain][install], and running a complete machine learning workflow using Tensorflow. This workflow corresponds to the [Kaptain SDK with Tensorflow tutorial][tensorflow], and includes the training, tuning, and deploying stages of a machine learning model used to recognize handwritten digits.

The resources in the table are required exclusively for each specified task, and assume you have previously allocated other resources to install and run DKP. Running any real world machine learning workload on Kaptain bumps these requirements. For this reason, the number of CPUs, GPUs, RAM, and persistent disk space **must be increased considerably**. 

Consider the following use cases as reference values:

| Cluster resource       | Kaptain installation | Kaptain SDK with Tensorflow tutorial |
|------------------------|----------------------|--------------------------------------|
| Number of worker nodes | at least 3           | at least 3                           |
| CPU per node           | 8 cores              | 24 cores                             |
| RAM per node           | 16 GiB               | 86 GiB                               |
| Storage per node       | 60 GiB               | 61 GiB                               |

<p class="message--note"><strong>NOTE: </strong>Only NVIDIA GPU instances are supported.</p>

The [Kaptain installation][install] example illustrates the resources required to install Kaptain and its dependencies without running any type of workload. In other words, the **bare minimum** resources. These resources must be **freely available** within the cluster for the installation to succeed.

The [Kaptain SDK with Tensorflow tutorial][tensorflow] example illustrates the resources required to install Kaptain and run the Kaptain SDK with Tensorflow tutorial. Again, these resources must be **freely available** within the cluster, and should not be allocated to any other applications.

For **on premise** installations, horizontal scalability is limited by the overall size of the cluster and its quotas.

For **cloud** installations, scaling out can be limited by resource quotas.

[install]: ../
[tensorflow]: ../../tutorials/sdk/tensorflow/