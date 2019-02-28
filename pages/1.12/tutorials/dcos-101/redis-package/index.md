---
layout: layout.pug
navigationTitle:  Installing the First Package
excerpt: Part 2 of the DC/OS 101 tutorial
title: Tutorial - Installing the First Package
menuWeight: 2
---


#include /include/tutorial-disclaimer.tmpl

Welcome to part 2 of the DC/OS 101 Tutorial.


# Prerequisites
By now, you should have a running DC/OS cluster and the DC/OS CLI installed and configured. If that isn't the case, please follow the [first](/1.12/tutorials/dcos-101/cli/) part of this tutorial.
The next stage of this tutorial uses [jq](https://stedolan.github.io/jq/), a command line JSON processor to simplify some of the commands. Follow the instructions [here](https://stedolan.github.io/jq/download/) to install JQ for your operating system.

# Objective
By the end of this session you will have installed your first service - [Redis](https://redislabs.com/) - from the DC/OS Universe repository. Redis is a key-value store, which you will use for persisting data in this tutorial.

# Steps
  * Install Redis
      * Search the Universe repository for Redis packages:

        ```bash
        dcos package search redis
        ```

        This should return two entries (mr-redis and redis).

      * You are interested in the `redis` package, which installs a single Redis container. Install the package with this command:

        ```bash
        dcos package install redis
        ```

  * You can use any of the following methods to check that Redis is running:
      * By looking at the GUI: The Redis task should be displayed in the Service Health tab along with the health status.
      * By looking at all DC/OS tasks with the `dcos task` command. This command will show us all running DC/OS tasks (i.e. Mesos tasks).
      * By looking at all Marathon apps: `dcos marathon app list`. This command will show us all running Marathon apps. Since services are started via Marathon, you should see Redis here as well. Note that the health status (i.e., 1/1) is also shown here.
      * By looking at the Redis log: `dcos task log redis`. This command will show us the logs (`stdout` and `stderr`) of the redis task. This allows you to check whether the actual startup was successful. You can increase the number of log lines displayed by using the `--lines=` argument; the default is 10.  
  * Let's use Redis by storing a key manually via the `redis-cli` command
      * [SSH](/1.12/administering-clusters/sshcluster/) into the node where redis is running:

        ```bash
        dcos node ssh --master-proxy --mesos-id=$(dcos task  redis --json |  jq -r '.[] | .slave_id')
        ```

      * Because Redis is running in a Docker container, you can list all Docker containers using `docker ps` and get the ContainerID of the container running the Redis service.
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

# Outcome
  You have just successfully installed your first service from the Catalog and verified it is running!

# Deep Dive
  [Catalog](https://github.com/mesosphere/universe) is a package repository made available for DC/OS Clusters.
  It enables you to easily install services such as Apache Spark or Apache Cassandra in your cluster without having to deal with manual configuration. Catalog packages are developed and maintained by many different contributors.

  There are currently two categories of packages:
  1. Curated packages that have undergone testing and certification.
  1. Community contributed packages, which may not be as well tested.

  You can also add your own repo that includes your custom packages. See the [documentation](/1.12/administering-clusters/repo/) for details.

In [the next section](/1.12/tutorials/dcos-101/app1/) you will deploy a simple app connecting to Redis.