---
layout: layout.pug
navigationTitle:  Install the first package
title: Install the first package
excerpt: Illustrates how to install a sample service package (part 3)
menuWeight: 3
render: mustache
model: /1.13/data.yml
---
Now that you have a DC/OS cluster installed and running on master and agent nodes and have installed the DC/OS command-line interface (CLI) to work with your cluster, you are ready to begin adding packages and applications to the cluster.

# Before you begin
Before starting this tutorial, you should verify the following:
- You have access to a running [DC/OS cluster](../start-here/) with at least at least one master node and three agent nodes.
- You have access to a computer where the [DC/OS CLI](../cli/) is installed.
- You can open a command-line shell on the computer hosting the CLI.
- You can open secure shell (SSH) sessions on remote cluster nodes. 
<!--
To perform some steps in this tutorial, you also need access to the `jq` language JSON processor to simplify some of the commands and output format.
- Download [jq](https://stedolan.github.io/jq/download/) and follow the instructions to install JQ for your operating system.-->

# Learning objectives
By completing this tutorial, you will learn:
- How to search for services in the DC/OS package repository.
- How to install a service you want available in the DC/OS cluster.
- How to run a few basic commands for working with your first service.

# Search for a package
For this tutorial, you are going to install [Redis](https://redislabs.com/). Redis is an open source key-value data structure store. It is commonly used as a database, cache manager, and message broker. It supports in-memory data retrieval, on-disk persistence, and high availability.

You can search for packages you want to install on the DC/OS cluster by using the DC/OS web-based administrative console or by running DC/OS command-line programs.

## Search using the DC/OS web-based console
To search for Redis using the DC/OS web-based administrative console:
1. Open a web browser and navigate to the URL for the DC/OS web-based administrative console. 

1. Click **Catalog**.

    The Catalog provides a package repository for services that are available for DC/OS clusters. If you have an Internet connection, the Catalog makes easy to install services with minimal manual configuration from a centralized location. 
    
    The packages in the Catalog are developed and maintained by many different contributors and include both **Certified** packages and that have been tested and validated by Mesosphere and **Community** that have been contributed to the package repository but in many cases have not been thoroughly tested.

1. Type a search string to locate the package you want to install.

    For example, type "redis" to find the package names that match the package you are going to install for this tutorial.

    ![Search for packages in the Catalog](/1.13/img/tutorial-redis-search.png)

    In this case, more than one package matches your search string. For this tutorial, however, you are only interested in the **redis** package. This package installs a single Redis instance in a Docker container.

1. Select the Redis package in the search results.

    If you are ready to install using the DC/OS web-based administrative console, continue to [Install using the DC/OS web-based console](#install-redis-gui).

<!--
1. Click **Review & Run**.

1. Verify the default service name.

    You can modify the service name, if needed. For example, you might want to name this service redis-tutorial.

1. Click **Redis** and verify the CPU and memory settings.

    ![Redis configuration settings](/1.13/img/tutorial-redis-config.png)

1. Click **Review & Run** to verify your Redis configuration, then click **Run Service**.

    ![Redis configuration settings](/1.13/img/tutorial-redis-run.png)

1. Click **Open Service** to view the status of the Redis deployment.

    ![Redis configuration settings](/1.13/img/tutorial-redis-open-service.png)
-->

## Search using the DC/OS CLI
To search for Redis by running DC/OS CLI commands:
1. Open a terminal shell on the computer where you have access to the DC/OS command-line interface (CLI).

1. Search for the package by running the following command:

    ```bash
    dcos package search redis
    ```

1. Review the output for the command.

    For example, this command returns the following entries:
    ```
    NAME      VERSION    SELECTED  FRAMEWORK  DESCRIPTION                                                                       
    mr-redis  0.0.1      False     True       Redis is the fastest in-memory KV-Cache and Datatstructure store                  
    redis     4.0-0.0.1  False     False      This is a single redis container, which is NOT suited for HA setups. Redis is...  
    ```

# Install the package
For this tutorial, you are only interested in the **redis** package. This package installs a single Redis instance in a Docker container. You can install this package using the DC/OS web-based administrative console or by running command-line program.

<a name="install-redis-gui"></a>

## Install using the DC/OS web-based console
To install the Redis package using the DC/OS web-based administrative console:
1. Open a web browser and navigate to the URL for the DC/OS web-based administrative console. 

1. Click **Catalog**.

1. Scroll or search to locate the Redis package you want to install.

    For this tutorial, select the **redis** package. This package installs a single Redis instance in a Docker container.

1. Click **Review & Run**.

1. Verify the default service name.

    You can modify the service name, if needed. For example, you might want to name this service **redis-tutorial**.

1. Click **Redis** and verify the CPU and memory settings.

    ![Redis configuration settings](/1.13/img/tutorial-redis-config.png)

1. Click **Review & Run** to verify your Redis configuration, then click **Run Service**.

    ![Redis configuration settings](/1.13/img/tutorial-redis-run.png)

1. Click **Open Service** to view the status of the Redis deployment.

    ![Redis configuration settings](/1.13/img/tutorial-redis-open-service.png)

## Install using the DC/OS CLI
1. Open a terminal shell on the computer where you have access to the DC/OS command-line interface (CLI).

1. Install the Redis package by running the following command:

    ```bash
    dcos package install redis --yes 
    ```
# Verify the service is installed and running
You can verify that the Redis service is currently running and reporting a Healthy status using the DC/OS web-based administrative console or by running command-line programs.

## Check Redis status in the DC/OS web-based console
1. Open the DC/OS web-based administrative console. 

1. Click **Services** to view the list of deployed services. 

1. Verify the Status column for Redis displays Running.

    ![Checking the Redis service status](/1.13/img/tutorial-redis-status.png)

1. Click the service name to display task-level details.

    ![Checking the Redis details](/1.13/img/tutorial-redis-details.png)

## Check Redis status using DC/OS commands
1. Open a terminal shell on the computer where you have access to the DC/OS command-line interface (CLI).

1. Check DC/OS task information by running the following command:

    ```bash
    dcos task
    ```

    This command displays basic information for all running DC/OS tasks. For example:

    ```
    NAME            HOST        USER  STATE  ID                                                                   MESOS ID                                     REGION          ZONE       
    redis-tutorial  10.0.1.192  root    R    redis-tutorial.instance-f4adfcf2-830c-11e9-9380-d281e1886025._app.1  da7a5a1b-ee52-4127-baf2-4989ba6fffea-S1  aws/us-west-2  aws/us-west-2a 
    ```

1. Review information for all deployed Marathon apps by running the following command:

    ```bash
    dcos marathon app list
    ```

    Because Marathon is used to start the Redis service, Redis is listed in the output for this command. Notice that the Health column indicates that Redis is configured to run one instance and one instance is currently running (1/1).
    
    ```bash
    ID               MEM   CPUS  TASKS  HEALTH  DEPLOYMENT  WAITING  CONTAINER  CMD  
    /redis-tutorial  1024   1     1/1    1/1       ---      False      DOCKER   N/A  
    ```

1. Check the Redis log file by running the following command:
 
    ```bash
    dcos task log redis
    ``` 
 
    This command displays the standard output (stdout) and standard error (stderr) logs for the Redis task. The log file output enables you to check whether the actual startup was successful. By default, the command displays the last 10 lines of logged activity. You can change the number of log lines displayed by specifying the `--lines=` argument. For example, if you run `dcos task log redis --lines=5`, you might see output similar to the following:

    ```bash
    1:M 27 Jun 18:17:31.449 # WARNING: The TCP backlog setting of 511 cannot be enforced because /proc/sys/net/core/somaxconn is set to the lower value of 128.
    1:M 27 Jun 18:17:31.449 # Server initialized
    1:M 27 Jun 18:17:31.449 # WARNING overcommit_memory is set to 0! Background save may fail under low memory condition. To fix this issue add 'vm.overcommit_memory = 1' to /etc/sysctl.conf and then reboot or run the command 'sysctl vm.overcommit_memory=1' for this to take effect.
    1:M 27 Jun 18:17:31.449 # WARNING you have Transparent Huge Pages (THP) support enabled in your kernel. This will create latency and memory usage issues with Redis. To fix this issue run the command 'echo never > /sys/kernel/mm/transparent_hugepage/enabled' as root, and add it to your /etc/rc.local in order to retain the setting after a reboot. Redis must be restarted after THP is disabled.
    1:M 27 Jun 18:17:31.449 * Ready to accept connections
    ```

# Test service operations  
Now that you have installed the Redis package, deployed the service on the cluster, and verified that the service is healthy, you can complete this tutorial by using Redis to store a key-value pair manually using the `redis-cli` command.

1. Open a terminal shell on a computer with network access to the cluster.

1. Open a secure shell ([SSH])(/1.13/administering-clusters/sshcluster/) session on the cluster node where the Redis service is running.

    There are several ways you can determine the cluster node address and Mesos task identifier for the Redis service running on that node. 
    
    For example, if you know the host name or IP address, have the appropriate login credentials, and are authorized to use SSH to connect to the computer, you can access the node by running a command similar to the following:  

    ```bash
    ssh <agent-node-ip> -l <authorized-user>
    ```

    You can also use `dcos task` to look up the Mesos ID for the Redis service, then open a secure shell using a command similar to the following:

    ```bash
    dcos node ssh --master-proxy --mesos-id=dedbb786-feb7-47f2-ae69-27bf86ba53fb-S0
    ```

    If you are prompted to confirm connecting to the host, type `yes`.

1. List the Docker containers to get the `ContainerID` for the container running the Redis service by running the following command:

    ```bash
    sudo docker ps
    ```

    This command returns output similar to the following:

    ```
    CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
    296b18087535        redis:4.0           "docker-entrypoint.s…"   About an hour ago   Up About an hour    0.0.0.0:3617->6379/tcp   mesos-6e81fd7b-9fa8-470d-9378-49b4a01b2d11
    ```

1. Start a shell session in the running container by running the following command and substituting the CONTAINER_ID argument with the container ID you got from running the `docker ps` command:

    ```bash
    sudo docker exec -i -t CONTAINER_ID  /bin/bash
    ```

1. Start the Redis CLI client by running the following command:

    ```bash
    redis-cli
    ```

1. Set a key with a value by running the following command:

    ```bash
    set tutorial my-tutorial-key-value
    ```

1. Verify the key-value pair by running the following command:

    ```bash
    get tutorial
    ```
    
1. Add additional keys using the `redis-cli`, if needed.

    In the next tutorial, you will deploy a simple application that connects to the Redis service and retrieves the number of keys defined.

1. Exit the `redis-cli` client, close the Redis connection, and end the secure shell session.

# Next steps
You have successfully installed your first service from the package repository and verified it is running.

The next tutorials explore additional getting started tasks that you can perform using the DC/OS web-based administrative console or command-line interface:
- [Deploy your first sample application](../first-app/)
- [Create and run custom apps](../create-service/)
- [Discover deployed services](../service-discovery/)
- [Deploy native containerized applications](../native-app/)
  
# Related topics
The DC/OS [Catalog](/1.13/gui/catalog/) (or [Universe](https://github.com/mesosphere/universe) in previous versions of DC/OS) is a package repository for services that are available for installation on DC/OS clusters.

The package repository enables you to easily install certified or community-contributed services, such as Apache Spark or Apache Cassandra, in your cluster without having to locate, download, and configure independent packages manually. If your cluster runs on an isolated network without an internet connection, you can create and manage your own site-specific package repository.

For information about creating your own package repository that includes your custom packages, see [Deploying a local Universe](../../../administering-clusters/deploying-a-local-dcos-universe/) for details.
