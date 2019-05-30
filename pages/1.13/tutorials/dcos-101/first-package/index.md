---
layout: layout.pug
navigationTitle:  Install the first package
title: Install the first package
excerpt: Illustrates how to install a sample service package (part 3)
menuWeight: 2
---
Now that you have a DC/OS cluster installed and running on master and agent nodes and have installed the DC/OS command-line interface (CLI) to work with your cluster, you are ready to begin adding packages and applications to the cluster.

# Before you begin
Before starting this tutorial, you should verify the following:
- You have access to a running [DC/OS cluster](../start-here/) with at least at least one master node and three agent nodes.
- You have access to a computer where the [DC/OS CLI](../cli/) is installed.

To perform some steps in this tutorial, you also need access to the `jq` language JSON processor to simplify some of the commands and output format.
- You must be able to open a command-line shell on the computer hosting the CLI.
- Download [jq](https://stedolan.github.io/jq/download/) and follow the instructions to install JQ for your operating system.

# Learning objective
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

    The Catalog provides a package repository for services that are available for DC/OS clusters. If you have an Internet connection, the Catalog makes easy to install services with minimal manual configuration from a centralized location. The packages in the Catalog are developed and maintained by many different contributors and include both **Certified** packages and that have been tested and validated by Mesosphere and **Community** that have been contributed to the package repository but in many cases have not been thoroughly tested.

1. Type a search string to locate the package you want to install.

    For example, type "redis" to find the package names that match the package you are going to install for this tutorial.

    ![Search for packages in the Catalog](/1.13/img/tutorial-redis-search.png)

1. Select the Redis package in the search results.

    For this tutorial, you are only interested in the **redis** package. This package installs a single Redis instance in a Docker container.

1. Click **Review & Run**.

1. Verify the default service name.

    You can modify the service name, if needed. For example, you might want to name this service redis-tutorial.

1. Click **Redis** and verify the CPU and memory settings.

    ![Redis configuration settings](/1.13/img/tutorial-redis-config.png)

1. Click **Review & Run** to verify your Redis configuration, then click **Run Service**.

    ![Redis configuration settings](/1.13/img/tutorial-redis-run.png)

1. Click **Open Service** to view the status of the Redis deployment.

    ![Redis configuration settings](/1.13/img/tutorial-redis-open-service.png)

## Search using the DC/OS CLI
To search for Redis by running DC/OS CLI commands:
1. Open a terminal shell on the computer where you have access to the DC/OS command-line interface (CLI).

1. Search for the package by running the following command:

    ```bash
    dcos package search redis
    ```

1. Review the output for the command.

    For example, this command returns the following entries:

    NAME      VERSION    SELECTED  FRAMEWORK  DESCRIPTION                                                                       
    mr-redis  0.0.1      False     True       Redis is the fastest in-memory KV-Cache and Datatstructure store                  
    redis     4.0-0.0.1  False     False      This is a single redis container, which is NOT suited for HA setups. Redis is...  

# Install the package
For this tutorial, you are only interested in the **redis** package. This package installs a single Redis instance in a Docker container. You can install this package using the DC/OS web-based administrative console or by running command-line program.

## Install using the DC/OS web-based console


## Install using the DC/OS CLI
1. Open a terminal shell on the computer where you have access to the DC/OS command-line interface (CLI).

1. Install the Redis package by running the following command:

    ```bash
    dcos package install redis
    
    ```
# Verify the service is installed and running
You can verify that the Redis service is currently running and reporting a Healthy status using the DC/OS web-based administrative console or by running command-line programs.

## Check the status of the Redis service in the DC/OS web-based console
1. Open the DC/OS web-based administrative console. 

1. Click **Services** to view the list of deployed services. 

1. Verify the Status column for Redis displays Running.

    ![Checking the Redis service status](/1.13/img/tutorial-redis-status.png)

1. Click the service name to display task-level details.

    ![Checking the Redis details](/1.13/img/tutorial-redis-details)

## Check the status of the Redis service using DC/OS commands
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
 
    This command displays the standard output (stdout) and standard error (stderr) logs for the Redis task. The log file output enables you to check whether the actual startup was successful. By default, the command displays the last 10 lines of logged activity. You can change the number of log lines displayed by specifying the `--lines=` argument.

# Test package operations  
Now that you have installed the Redis package, deployed the service on the cluster, and verified that the service is healthy, you can complete this tutorial by using Redis to store a key-value pair manually using the redis-cli command.
1. Open a secure shell [SSH](/1.13/administering-clusters/sshcluster/) session on the node where the Redis service is running:

    ```bash
    dcos node ssh --master-proxy --mesos-id=$(dcos task redis --json |  jq -r '.[] | .slave_id')
    ```

1. List the Docker containers to get the ContainerID for the container running the Redis service by running the following command:

    ```bash
    docker ps
    ```

1. Start a shell session in the running container, substituting CONTAINER_ID with the ContainerID you got from the previous command:

    ```bash
    sudo docker exec -i -t CONTAINER_ID  /bin/bash
    ```

1. Start the Redis CLI client by running the following command:

    ```bash
    redis-cli
    ```

1. Set a key with a value by running the following command:

    ```bash
    set tutorial testkey1
    ```

1. Verify the key-value pair by running the following command:

    ```bash
    get tutorial
    ```

# Next steps
  You have just successfully installed your first service from the package repository and verified it is running.
  
# Related topics
  [Universe](https://github.com/mesosphere/universe) is a package repository made available for DC/OS Clusters.
  It enables you to easily install services such as Apache Spark or Apache Cassandra in your cluster without having to deal with manual configuration. Universe packages are developed and maintained by many different contributors.

  There are currently two categories of packages:
  1. Curated packages that have undergone testing and certification.
  1. Community contributed packages, which may not be as well tested.

  You can also add your own repo that includes your custom packages. See the [documentation](/administering-clusters/repo/) for details.
