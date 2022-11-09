---
layout: layout.pug
navigationTitle: Requirements
title: Requirements
menuWeight: 2
excerpt: Requirement reference values
beta: false
enterprise: false
---

The quantity of resources required for your project depends primarily on the workload you want to run. The amount necessary will depend upon:

- The number, complexity, and size of your training jobs, notebook servers, deployed models, etc.
- The amount of metadata and log data stored with each run.

To estimate the amount of resources required for your project, we recommend that you test your specific use case.

For example, the following table lists the resources required for two typical operations: [installing Kaptain][install], and running a complete machine learning workflow using Tensorflow. This workflow corresponds to the [Kaptain SDK with Tensorflow tutorial][tensorflow], and includes the training, tuning, and deploying stages of a machine learning model that recognizes handwritten digits.

The resources in the table are required exclusively for each specified task, and assume you have previously allocated other resources to install and run DKP. These are minimums; 'real-world' machine learning workloads will require **substantially more** of all the resource types.

Consider the following use cases as reference values:

| Cluster resource       | Kaptain installation | Kaptain SDK with Tensorflow tutorial |
|------------------------|----------------------|--------------------------------------|
| Number of worker nodes | at least 3           | at least 3                           |
| CPU per node           | 8 cores              | 16 cores                             |
| RAM per node           | 16 GiB               | 32 GiB                               |
| Storage per node       | 120 GiB               | 120 GiB                               |

<p class="message--note"><strong>NOTE: </strong>Only NVIDIA GPU instances are supported.</p>

The [Kaptain installation][install] column lists the resources required to install Kaptain and its dependencies without running any type of workload. In other words, the **bare minimum** resources. These resources must be **freely available** within the cluster for the installation to succeed.

The [Kaptain SDK with Tensorflow tutorial][tensorflow] column lists the resources required to install Kaptain and run the Kaptain SDK with Tensorflow tutorial. Again, these resources must be **freely available** within the cluster, and should not be allocated to any other applications.

For **on-premises** installations, horizontal scalability is limited by the overall size of the cluster and its quotas.

For **cloud** installations, scaling out can be limited by resource quotas.

[install]: ../
[tensorflow]: ../../tutorials/sdk/tensorflow/
