---
layout: layout.pug
navigationTitle: Create a cluster
title: Create a cluster
menuWeight: 1
excerpt: Let's start your DC/OS tour by creating a cluster (part 1)
---
This tutorial demonstrates the basic steps for creating a small DC/OS cluster using the most common default configuration options and verifying access to the cluster. You must successfully complete the steps in this tutorial before you can perform any other administrative tasks or explore additional features.

After completing this tutorial, you will have a single DC/OS cluster consisting of:
- One [master node](/1.13/overview/architecture/node-types/#master-node).
- Two [private agent nodes](/1.13/overview/architecture/node-types/#private-agent).
- One [public agent node]((/1.13/overview/architecture/node-types/#public-agent)).

The tutorial takes approximately 20 minutes to complete.

If you need additional information about hardware or software system requirements or help performing any step, see the [setup instructions](/latest/installing/).

# Before you begin
To get started with this tutorial, you must have access to a physical computer or virtual machine image with a supported operating system.

You must also have an account with administrative privileges for the local operating system or the cloud provider instance where you plan to install DC/OS.

Before starting the tutorial, you should verify you have an appropriate level of background information required to complete tutorial tasks, including:
- Basic understanding of cluster-related concepts, software containers, distributed workload processing, and application deployment.

- General familiarity with Linux system administration and how to use common command-line programs for working with files and directories, such as `ls`, `mkdir`, and `rm` commands. 

    You should also know how to display usage information and command-specific `man` pages.

- Basic text-editing skills and experience working with configuration files, JSON-formatted files, and text editors such as `vim` or `nano`.

- Experience using a terminal shell and secure shell (SSH) connections to access remote servers and workstations.

    You must be able to start SSH sessions using a client application such as iTerm, Konsole, gnome-terminal, or PuTTY.

# Learning objectives
For simplicity, this tutorial guides you through creating a cluster with a single master node. To run production workloads, however, you should have multiple master nodes.

By completing this tutorial, you will learn:
- How to download the installation package and create a bootstrap node for distributing installation files.
- How to distribute the installation package and designate a computer as a master node.
- How to distribute the installation package and configure private and public agent nodes.
- How to open the DC/OS web-based administrative console and use it to view basic information about your cluster in a web browser.
- How to install the DC/OS command-line interface and use it to explore your cluster.

# To create a new cluster
1. Identify a computer to act as the **bootstrap node** for the new cluster.

    The bootstrap node computer provides a centralized location for configuring and distributing files for the DC/OS cluster. In most cases, the bootstrap node computer:
    - Is a server that is not part of the DC/OS cluster.
    - Can be backed up and shut down after installation is complete.
    - Must be able to connect over the network to all cluster nodes.
    - Allows SSH access into all other nodes in the cluster. 

1. Log on to the bootstrap node using administrative credentials.

1. Download DC/OS artifacts to the bootstrap node.

1. Check whether the Docker system process (dockerd) is running by running a command similar to the following:

    ```bash
    docker info
    ```

    This command returns an error out if the Docker daemon process is not available.

1. 

Congratulations! You have successfully connected to your cluster using the DC/OS CLI, and started exploring some of the CLI commands.
You will make further use of the CLI in the sections that follow.

# Next steps

# Related topics
If you want to know more about the DC/OS architecture and key components, see the following topics: 
- [Mesos](/overview/architecture/components/#apache-mesos) containers and orchestration.
- [Marathon](/overview/architecture/components/#marathon) framework and application definitions.
- [Metronome](/overview/architecture/components/#marathon) job management and scheduling.

For an overview of the DC/OS platform and the components that make up the architectural layers of the platform, see the [Architectural overview](latest/overview/architecture/components/).
