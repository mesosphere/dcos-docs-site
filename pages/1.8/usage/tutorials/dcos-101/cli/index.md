---
layout: layout.pug
excerpt:
title: First Steps
navigationTitle: First Steps
menuWeight: 1
oss: true
---

Welcome to part 1 of the DC/OS 101 Tutorial.

# Prerequisites
To get started with this tutorial, you should have access to a running DC/OS OSS cluster with at least a single master node and 3 agent nodes (of which one is a public agent node). If you don't have these requirements set up, please follow the [setup instructions](https://dcos.io/install/) for various cloud providers, on-premise, or vagrant setups.
If you are unsure which option to choose, then we would recommend using the <a href="https://downloads.dcos.io/dcos/stable/1.8.9/aws.html" target="_blank">AWS templates</a>.

**Note**: For this tutorial a setup with a single master node is suffcient, but for running production workloads you should have multiple master nodes.

# Objective
We have access to our cluster and have already taken a first look at the UI. You can also access the cluster from your local machine via the DC/OS CLI.
By the end of this section we will have installed the DC/OS CLI and used it to explore our cluster.

# Steps
  * Install the DC/OS CLI
    * Follow the steps [here](/1.8/usage/cli/install/) or the `Install CLI` instruction in the lower left corner of the DC/OS UI.
    * Make sure you are authorized to connect to your cluster by running `dcos auth login`. This is necessary to prevent access from unauthorized people to your cluster.
    * You can also add/invite friends and co-workers to your cluster. See [user management documentation](/1.8/administration/id-and-access-mgt/user-management/) for details

  * Explore the cluster:
      * Check the running services with `dcos service`. Unless you already installed additional services, there should be two services running on your cluster: marathon (basically the DC/OS init system) and metronome (basically the DC/OS cron scheduler).
      * Check the connected nodes with `dcos node`. You should be able to see your connected agents nodes (i.e., not the master nodes) in your cluster.
      * Explore the logs of the leading mesos master with `dcos node log --leader`. Mesos is basically the kernel of DC/OS and hence we will explore Mesos logs at multiple times during this tutorial.
      * To explore more CLI options, enter the `dcos help` command. There are also help options of the individual commands available e.g., `dcos node --help`. Alternatively, check the [CLI documentation](/1.8/usage/cli/).

# Outcome
Congratulations! We have successfully connected to your cluster using the DC/OS CLI, and started exploring some of the CLI commands.
We will make further use of the CLI in the sections that follow.

# Deep Dive
We have already encountered several DC/OS components (including Mesos, Marathon, or Metronome) while experimenting with the DC/OS CLI.
But what other components make up DC/OS?

## DC/OS components
DC/OS includes a number of components, many of which you can safely ignore for now and hence we only list the most relevant components here.
A description of all components can be found in the [documentation](/1.8/overview/components/).
* Marathon starts and monitors DC/OS applications and services.
* Mesos is the kernel of DC/OS and responsible for low-level task maintenance.
* Mesos DNS provides service discovery within the cluster.
* Minuteman is the internal layer 4 load balancer.
* Admin Router is an open source NGINX configuration that provides central authentication and proxy to DC/OS services.
* Universe is the package repository that holds the DC/OS services (e.g., Apache Spark of Apache Cassandra) that you can install on your cluster directly from the DC/OS UI and CLI.

## DC/OS Terminology
Again we will focus on the most important terminology here. More details can be found in the [documentation](/1.8/overview/architecture/).
* Master: aggregates resource offers from all agent nodes and provides them to registered frameworks.
* Agent: runs a discrete Mesos task on behalf of a framework. The synonym of agent node is worker or slave node.
* Scheduler: the scheduler component of a service, for example, the Marathon scheduler.
* Task: a unit of work scheduled by a Mesos framework and executed on a Mesos agent.
