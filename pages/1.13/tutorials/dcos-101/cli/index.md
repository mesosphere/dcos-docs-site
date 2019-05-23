---
layout: layout.pug
excerpt: Install the command-line interface to perform your day-to-day tasks
title: Install the command-line interface
navigationTitle: Install the command-line interface
menuWeight: -1
---
The DC/OS command-line interface (CLI) provides a convenient way for you to perform your administrative tasks, retrieve information about components and operations, and monitor cluster status and activity. 

Although you can perform many of the same tasks interactively using the DC/OS web-based console or programmatically using calls to the DC/OS application programming interface (API), most cluster operators use command-line programs interactively or in scripts to manage most of their common cluster operations and cluster-related activity.

# Before you begin
Before starting this tutorial, you should verify the following:
- You can access a properly-configured DC/OS cluster with at least at least one master node and three agent nodes.
- - You must have an account with administrative privileges for the local operating system.

# Learning objective
You have access to your cluster and have already taken a first look at the GUI. You can also access the cluster from your local machine using the DC/OS CLI. By the end of this section, you will have installed the DC/OS CLI and used it to explore your cluster.

# Steps
  * Install the DC/OS CLI
    * Follow the steps [here](/cli/install/) or the `Install CLI` instruction in the lower left corner of the DC/OS GUI.
    * Make sure you are authorized to connect to your cluster by running `dcos auth login`. This is necessary to prevent access from unauthorized people to your cluster.
    * You can also add/invite friends and co-workers to your cluster. See [user management documentation](/security/ent/users-groups/) for details

  * Explore the cluster:
      * Check the running services with `dcos service`. Unless you already installed additional services, there should be two services running on your cluster: Marathon (basically the DC/OS init system) and metronome (basically the DC/OS cron scheduler).
      * Check the connected nodes with `dcos node list`. This command displays some basic information about the connected agent and master nodes in your cluster.
      * Explore the logs of the leading mesos master with `dcos node log --leader`. Mesos is basically the kernel of DC/OS and this tutorial explores the Mesos logs at multiple times during this tutorial.
      * To explore more CLI options, enter the `dcos help` command. There are also help options of the individual commands available e.g., `dcos node --help`. Alternatively, check the [CLI documentation](/cli/).

# Outcome
Congratulations! You have successfully connected to your cluster using the DC/OS CLI, and started exploring some of the CLI commands.
You will make further use of the CLI in the sections that follow.

# Deep Dive
You have already encountered several DC/OS components (including Mesos, Marathon, or Metronome) while experimenting with the DC/OS CLI.
But what other components make up DC/OS?

## DC/OS components
Here are the DC/OS components that are relevant to this tutorial. A full description of all components can be found in the [documentation](/overview/architecture/components/).
* [Marathon](/overview/architecture/components/#marathon) starts and monitors DC/OS applications and services.
* Apache [Mesos](/overview/architecture/components/#apache-mesos) is the kernel of DC/OS and responsible for low-level task maintenance.
* [Mesos DNS](/overview/architecture/components/#mesos-dns) provides service discovery within the cluster.
* [Minuteman](/overview/architecture/components/#minuteman) is the internal layer 4 load balancer.
* [Admin Router](/overview/architecture/components/#admin-router) is an open source NGINX configuration that provides central authentication and proxy to DC/OS services.
* [Universe](/overview/architecture/components/#dcos-package-manager) is the package repository that holds the DC/OS services (e.g. Apache Spark or Apache Cassandra) that you can install on your cluster directly from the DC/OS GUI and CLI.
