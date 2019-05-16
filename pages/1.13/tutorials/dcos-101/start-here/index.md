---
layout: layout.pug
navigationTitle: Create a cluster
title: Create a cluster
menuWeight: 1
excerpt: Let's start your DC/OS tour by creating a cluster (part 1)
---
This tutorial demonstrates the basic steps for creating a small DC/OS cluster using the most common default configuration options and verifying access to the cluster. You must successfully complete the steps in the this tutorial before you can perform any other administrative tasks or explore additional features.

After completing this tutorial, you will have a single DC/OS cluster consisting of:
- One master node.
- Two private agent nodes.
- One public agent node.

The tutorial takes approximately 20 minutes to complete.

If you need additional information about hardware or software system requirements or perform any step, see the [setup instructions](/latest/installing/).

# Before you begin
To get started with this tutorial, you must have access to a physical computer or virtual machine image with a supported operating system.

You must also have an account with administrative privileges for the local operating system or the cloud provider instance where you plan to install DC/OS.

For simplicity, this tutorial guides you through creating a cluster with a single master node. To run production workloads, however, you should have multiple master nodes.

# Learning objectives
By completing this tutorial, you will learn:
- How to download the installation package and create a bootstrap node for distributing installation files.
- How to distribute the installation package and designate a computer as a master node.
- How to distribute the installation package and configure private and public agent nodes.
- How to open the DC/OS web-based administrative console and use it to view basic information about your cluster in a web browser.
- How to install the DC/OS command-line interface and use it to explore your cluster.

# To create a new cluster
1. Install the DC/OS CLI


Congratulations! You have successfully connected to your cluster using the DC/OS CLI, and started exploring some of the CLI commands.
You will make further use of the CLI in the sections that follow.

# Next steps

# Related topics
If you want to know more about the DC/OS architecture and key components, see the following topics: 
- [Mesos](/overview/architecture/components/#apache-mesos) containers and orchestration.
- [Marathon](/overview/architecture/components/#marathon) framework and application definitions.
- [Metronome](/overview/architecture/components/#marathon) job management and scheduling.

For an overview of the DC/OS platform and the components that make up the architectural layers of the platform, see the [Architectural overview](latest/overview/architecture/components/).
