---
layout: layout.pug
navigationTitle: Create a cluster
title: Create a cluster
menuWeight: 1
excerpt: Let's start your DC/OS tour by creating a cluster (part 1)
render: mustache
model: /1.13/data.yml
---
This tutorial demonstrates the basic steps for creating a small DC/OS cluster using the most common default configuration options and verifying access to the cluster. You must successfully complete the steps in this tutorial before you can perform any other administrative tasks or explore additional features.

After completing this tutorial, you will have a single DC/OS cluster consisting of:
- One [master node](../../../overview/architecture/node-types/#master-nodes).
- Two [private agent nodes](../../../overview/architecture/node-types/#agent-nodes).
- One [public agent node](../../../overview/architecture/node-types/#agent-nodes).

The tutorial takes approximately 20 minutes to complete.

If you need additional information about hardware or software system requirements or help performing any step, see the [setup instructions](../../../installing/).

# Before you begin
To get started with this tutorial:
- You must have access to a physical computer or virtual machine image with a supported operating system.

- You must have an account with administrative privileges for the local operating system or the cloud provider instance where you plan to install DC/OS.

- You must have a supported version of [Docker](https://www.docker.com/get-started) installed.

Before starting the tutorial, you should also verify that you have the following skills and information required to complete tutorial tasks.

### Knowledge
- Basic understanding of cluster-related concepts, software containers, distributed workload processing, and application deployment.

- General familiarity with Linux system administration and how to use common command-line programs for working with files and directories, such as `ls`, `mkdir`, and `rm` commands. 

    You should also know how to display usage information and command-specific `man` pages.

### Skills
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

# Preview of what you'll do
You need to perform the following key tasks to create a new DC/OS cluster:
- Prepare a [bootstrap node](/1.13/installing/production/system-requirements/#bootstrap).
- Configure a DC/OS [master node](https://docs.mesosphere.com/1.13/installing/production/system-requirements/#master-nodes).
- Configure DC/OS [private agent nodes](https://docs.mesosphere.com/1.13/installing/production/system-requirements/#agent-nodes).
- Configure a DC/OS [public agent node](https://docs.mesosphere.com/1.13/installing/production/system-requirements/#agent-nodes).

# Prepare a bootstrap node
1. Identify a computer to act as the **bootstrap node** for the new cluster.

    The [bootstrap node](/1.13/installing/production/system-requirements/#bootstrap) computer provides a centralized location for configuring and distributing files for the DC/OS cluster. The bootstrap node:
    - Must be able to connect over the network to all cluster nodes using SSH. 
    - Can be backed up and shut down after installation is complete.
    - Should not be included in the DC/OS cluster.

1. Log on to the bootstrap node using administrative credentials.

1. Check whether the Docker system process (`dockerd`) is available by running a command similar to the following:

    ```bash
    docker info
    ```

    This command returns an error if the Docker daemon process is not available.

1. Download [DC/OS Open Source](https://downloads.dcos.io/dcos/stable/1.13.2/dcos_generate_config.sh) or [DC/OS Enterprise](http://downloads.mesosphere.com/dcos-enterprise/stable/1.13.2/dcos_generate_config.ee.sh) artifacts to the bootstrap node.

1. Extract the contents from the file you downloaded by running a command similar to the following:

    ```bash
    /bin/sh dcos_generate_config.ee.sh
    ```

1. Change to the DC/OS configuration directory and verify you have the `config.yaml` file:

    ```bash
    cd genconf && ls -al
    ```

    Initially, the `config.yaml` file only contains a few lines that you can use as a skeleton for setting DC/OS configuration options.

## Prepare the cluster configuration files
1. Open the `config.yaml` file in a text editor to customize the settings for this tutorial.

    For example, modify the file with settings similar to the following:

    ```bash
    bootstrap_url: http://10.0.0.100
    cluster_name: 'Mesosphere DC/OS Tutorial'
    exhibitor_storage_backend: static
    master_discovery: static
    master_list:
    - 10.0.0.50
    resolvers:
    - 169.254.169.253
    - 127.0.0.1
    security: permissive
    ```

    You can set many more basic and advanced configuration options using the `config.yaml` file. For information about the settings available and examples of the most commonly-used settings, see the [advanced configuration reference](/1.13/installing/production/advanced-configuration/configuration-reference/) and [examples](/1.13/installing/production/deploying-dcos/configuration/examples/).

1. Save your configuration settings.

1. Add required scripts or files to the `genconf` directory.

    In addition to the `config.yaml` file, you should provide the following files in the `genconf` directory:
    - [ip-detect](/1.13/installing/production/deploying-dcos/installation/#ip-detect-script) - This script is required for all DC/OS clusters.
    - [license.txt](/1.13/installing/production/deploying-dcos/installation/#license) - This file is required for DC/OS Enterprise clusters.
    - [fault-domain-detect](/1.13/installing/production/deploying-dcos/installation/#fault-domain) - This script is required for DC/OS Enterprise clusters.

## Create the distribution center
1. Run the DC/OS installation script to generate the customized
build files for your cluster in the `./genconf/serve/`
directory.

    ```bash
    sudo bash dcos_generate_config.ee.sh
    ```

1. Prepare a web server NGINX Docker container to share the customized build files for distribution by running the following command on the bootstrap node:

    ```bash
    sudo docker run -d -p 80:80 -v $PWD/genconf/serve:/usr/share/nginx/html:ro nginx
    ```

# Create the master node
1. Open a terminal shell on the bootstrap node, then start a secure shell (SSH) session to connect to the master node.

    ```bash
    ssh <master-ip>
    ```

1. Create a new directory for the DC/OS master node files and navigate to it.

    ```bash
    mkdir /tmp/dcos && cd /tmp/dcos
    ```

1. Download the DC/OS installation script from the NGINX Docker container, replacing `bootstrap-ip` and `port` with the settings you specified for the `bootstrap_url` in the `config.yaml` file:

    ```bash
    curl -O http://<bootstrap-ip>:<your_port>/dcos_install.sh
    ```

1. Run the following command to install DC/OS on the master node.

    ```bash
    sudo bash dcos_install.sh master
    ```

In a production environment, you would repeat these steps to create two or four additional master nodes.

# Configure private agent nodes
1. Open a terminal shell on the bootstrap node, then start a secure shell (SSH) session to connect to the first private agent node.

    ```bash
    ssh <agent-ip>
    ```

1. Create a new directory for the DC/OS agent files and navigate to it.

    ```bash
    mkdir /tmp/dcos && cd /tmp/dcos
    ```

1. Download the DC/OS installation script from the NGINX Docker container, replacing `bootstrap-ip` and `port` with the settings you specified for the `bootstrap_url` in the `config.yaml` file:

    ```bash
    curl -O http://<bootstrap-ip>:<your_port>/dcos_install.sh
    ```

1. Run the following command to install DC/OS and designate this node as a **private agent** node.

    ```bash
    sudo bash dcos_install.sh slave
    ```
1. Repeat these steps to create a second private agent node.

In a production environment, you would automate these steps to create as many private agent nodes as you need.


# Configure the public agent node
1. Open a terminal shell on the bootstrap node, then start a secure shell (SSH) session to connect to the public agent node.

    ```bash
    ssh <agent-ip>
    ```

1. Create a new directory for the DC/OS agent files and navigate to it.

    ```bash
    mkdir /tmp/dcos && cd /tmp/dcos
    ```

1. Download the DC/OS installation script from the NGINX Docker container, replacing `bootstrap-ip` and `port` with the settings you specified for the `bootstrap_url` in the `config.yaml` file:

    ```bash
    curl -O http://<bootstrap-ip>:<your_port>/dcos_install.sh
    ```

1. Run the following command to install DC/OS and designate this node as a **public agent** node.

    ```bash
    sudo bash dcos_install.sh slave_public
    ```

# Verify your cluster is ready to use
1. Open a web browser and navigate to the master node IP address to access the DC/OS web-based administrative console. 

    For example, if the master node IP address is 192.168.47.1, enter http://192.168.47.1 as the URL in the browser address bar.

1. Type your administrative user name and password, then click **Log in**.

    ![Log in to the administrative console](/1.13/img/tutorial-sample-login.png)

    If the connection is successful, the DC/OS dashboard is displayed.

    ![DC/OS dashboard in the administrative console](/1.13/img/tutorial-sample-dashboard.png)

Congratulations! You have successfully created your first DC/OS cluster. You can now start exploring what you can do using this cluster in subsequent tutorials.

# Next steps
Now that you have a small cluster running, you can install the DC/OS command-line interface (CLI) and start exploring administrative and operational tasks.
- [Install the command-line interface](../cli/)
- [Install your first service from the package repository](../first-package/)
- [Deploy your first sample application](../first-app)

# Related topics
This tutorial focused on preparing and installing the DC/OS cluster interactively using a simple configuration file and a few manually entered commands. 

### More about your installation options
There are several other methods you can use to install the DC/OS cluster. For example, there are other installation options if you are installing DC/OS on a public cloud from a public cloud provider such as AWS, Azure, or the Google Cloud Platform. For information about other installation options, see the following topics:
- [DC/OS on AWS using the Universal Installer](/1.13/installing/evaluation/aws/)
- [DC/OS on Azure using the Universal Installer](/1.13/installing/evaluation/azure/)
- [DC/OS on GCP using the Universal Installer](/1.13/installing/evaluation/gcp/)
- [Other Installation methods](/1.13/installing/evaluation/community-supported-methods/)

### More about cluster architecture and components
For an overview of the DC/OS platform and the components that make up the architectural layers of the platform, see the [Architectural overview](../../../overview/architecture/).

If you want to know more about the DC/OS architecture and key components, see the following topics:

- [Platform ecosystem overview](../../../overview/architecture/components/)
- [Cluster management and orchestration with Mesos](../../../overview/architecture/components/#cluster-management).
- [Framework and application definitions with Marathon](../../../overview/architecture/components/#container-orchestration).
- [Job management and scheduling with Metronome](../../../overview/architecture/components/#dcos-jobs).