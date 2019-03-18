---
layout: layout.pug
excerpt: Understanding how DC/OS implements the Azure Container Service
title: The Azure Container Service
navigationTitle: ACS
menuWeight: 2
---

The [Azure Container Service](https://azure.microsoft.com/documentation/articles/container-service-deployment/) is a reference implementation of DC/OS optimized to take advantage of the features of Microsoft Azure infrastructure. If you already have an Azure account, you can try out a reference implementation of DC/OS built on Microsoft Azure by [creating an Azure Container Service cluster](https://aka.ms/acscreate). (Grab a [free Azure trial account](https://azure.microsoft.com/pricing/free-trial/) first if you do not have one.)

**Caution:** Mesosphere does not support Ubuntu as an operating system for DC/OS, even when using Microsoft Azure.

This document describes:

- Advantages of using DC/OS
- Azure infrastructure and the implementation architecture
- Bill of materials used to construct DC/OS and the ACS clusters

## Benefits of DC/OS

DC/OS is powered by Apache Mesos, used as the distributed kernel of a set of computers that you can treat as one unit, though you retain control of each one. In DC/OS, the kernel of the system is any number of Mesos masters and agents both publicly available and private; failed Mesos masters are replaced by a standby master transparently, and handles leader election. Masters handle failed agents and processes.

DC/OS applications function as system components in its distributed user space. The system Marathon component is the distributed `init` for DC/OS; but this also includes the Admin Router service, the Mesos-DNS service, Exhibitor, and other system-wide components that are used by user processes and manage the masters and agents.

For a more comprehensive architectural description of DC/OS, see [DC/OS Architecture](/1.13/overview/architecture/).

For a more complete discussion of components, see [DC/OS Components](/1.13/overview/architecture/components/).

### Why DC/OS and not Mesos?

Many companies [use Mesos directly with success](https://mesos.apache.org/documentation/latest/powered-by-mesos/). However, DC/OS has several important features that distinguish it from the open-source features of Mesos, and add functionality to your deployment.

1. Deploying and managing Mesos can be complex, precisely because it can manage very complex environments; DC/OS makes that complexity straightforward to use and supported by the community.
2. DC/OS implements fault tolerance not just on an industrial but on an internet scale.
3. The DC/OS universe of packages for easy installation supports developers, data scientists, and system administrators with all their favorite open source packages.
4. The real-time metrics "firehouse" is open for use by your favorite diagnostics and analytics packages.
5. DC/OS has three ways to administer your distributed OS: a CLI, a web interface, and an API.

### The Universe of packages

Here's a list of what is in the Universe on Day 1 of DC/OS, categorized by the type of license.

#### Apache License V2

- ArangoDB
- Apache Cassandra
- Crate
- Elastic Search
- Etcd
- Exhibitor
- Apache Hadoop
- Hue
- Jenkins
- Apache Kafka
- Linkerd
- Mr Redis
- Namerd
- Quobyte
- Riak
- Spark Notebook
- Apache Spark
- Apache Storm
- Docker Swarm
- Apache Zeppelin

#### Simplified BSD

- Datadog
- Nginx

#### MIT

- OpenVPN Admin
- OpenVPN
- Ruxit

Not only may you use the universe of packages available with the DC/OS packaging system, you can also publish there to give your skills back to the community. You may also want to deploy DC/OS yourself; you can start with a reference implementation of DC/OS in "the cloud" with the Azure Container Service.

## Azure Container Service infrastructure and optimizations

The Azure Container Service is built with DC/OS as one of the critical orchestration options. The DC/OS implementation is optimized for easy creation and usage on Microsoft Azure and on-premise, eventually with Azure Stack. It is one of the best ways to get started with DC/OS, Mesos, and a distributed cluster that can be managed like one large system, whether in your datacenter or in Azure.

The Azure Container Service implementation brings several more benefits to you:

1. It is the easiest way to get started with DC/OS. You only need to click a few buttons and provide a few parameters, then you are ready to deploy your apps. If you have an Azure account, [try it](https://aka.ms/acscreate).
2. DC/OS deployments are vetted and optimize specifically for Azure: all VMs, storage, networks, load balancers, and so on are created and configured for a highly available DC/OS cluster.
3. You have the ability to increase integration with Azure services if you decide it would benefit your deployments as the system moves forward.
4. ACS brings Microsoft support to the infrastructure to complement Mesosphere's support of DC/OS.

The default ACS architecture looks like this:

![Azure Container Service architecture using DC/OS.](/1.13/img/dcos-acs.png)

*Figure 1 - Azure Container Service architecture using DC/OS*

## DC/OS component list

The following list shows the components used by DC/OS itself. You'll note that the core components center around Mesos, Marathon, Python, and so on.


- adminrouter
- boost-system
- boto
- bouncer
- cosmos
- curl
- dcos-cluster-id
- dcos-diagnostics
- dcos-history-service
- dcos-image
- dcos-image-deps
- dcos-installer
- dcos-installer-ui
- dcos-metrics
- dcos-oauth
- dcos-signal
- dcos-ui
- dnspython
- erlang
- exhibitor
- flask
- hadoop
- hdfs-mesos
- java
- libevent
- logrotate
- marathon
- mesos
- mesos-buildenv
- mesos-dns
- mesos-metrics-module
- mesos-modules-private
- minuteman
- ncurses
- networking_api
- openssl
- python
- python-dateutil
- python-docopt
- python-jinja2
- python-kazoo
- python-markupsafe
- python-passlib
- python-pyyaml
- python-requests
- python-retrying
- six
- spartan
- strace
- toybox
- treeinfo.json
- zk-value-consensus
