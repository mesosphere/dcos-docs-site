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
For this tutorial, you are going to install [Redis](https://redislabs.com/). Redis is an open source key-value data structure store. It is commonly used as a database, cache manager, and message broker. It supports in-memory data retrieval, on-disk persistence, and high availability through replication and backups.

You can search for packages you want to install on the DC/OS cluster by using the DC/OS web-based administrative console or by running DC/OS command-line programs.

To search for Redis using the DC/OS web-based administrative console:

To search for Redis by running DC/OS CLI commands:

        ```bash
        dcos package search redis
        ```

        This should return two entries (mr-redis and redis).

# Install the package
      * You are interested in the redis package, which installs a single Redis container. Install the package with this command:

        ```bash
        dcos package install redis
        ```
# Verify the service is installed and running
  * You can use any of the following methods to check that redis is running:
      * By looking at the GUI: The Redis task should be displayed in the Service Health tab along with the health status.
      * By looking at all DC/OS tasks with the `dcos task` command. This command will show us all running DC/OS tasks (i.e. Mesos tasks).
      * By looking at all Marathon apps: `dcos marathon app list`. This command will show us all running Marathon apps. Since services are started via Marathon, you should see Redis here as well. Note that the health status (i.e. 1/1) is also shown here.
      * By looking at the Redis log: `dcos task log redis`. This command will show us the logs (stdout and stderr) of the redis task. This allows you to check whether the actual startup was successful. You can increase the number of log lines displayed by using the `--lines=` argument, the default is 10.

# Test package operations  
  * Let's use Redis by storing a key manually via the redis-cli command
      * [SSH](/administering-clusters/sshcluster/) into the node where redis is running:

        ```bash
        dcos node ssh --master-proxy --mesos-id=$(dcos task  redis --json |  jq -r '.[] | .slave_id')
        ```

      * Because Redis is running in a Docker container, you can list all Docker containers using `docker ps` and get the ContainerID of the container running the redis service.
      * Start a bash session in the running container, substituting CONTAINER_ID with the ContainerID you got from the previous command:

        ```bash
        sudo docker exec -i -t CONTAINER_ID  /bin/bash
        ```

      * Start the Redis CLI:

        ```bash
        redis-cli
        ```

      * Set a key with a value:

        ```bash
        set mykey key1
        ```

      * Check the value is there:

        ```bash
        get mykey
        ```

# Next steps
  You have just successfully installed your first service from the Universe repository and verified it is running!

# Related topics
  [Universe](https://github.com/mesosphere/universe) is a package repository made available for DC/OS Clusters.
  It enables you to easily install services such as Apache Spark or Apache Cassandra in your cluster without having to deal with manual configuration. Universe packages are developed and maintained by many different contributors.

  There are currently two categories of packages:
  1. Curated packages that have undergone testing and certification.
  1. Community contributed packages, which may not be as well tested.

  You can also add your own repo that includes your custom packages. See the [documentation](/administering-clusters/repo/) for details.
