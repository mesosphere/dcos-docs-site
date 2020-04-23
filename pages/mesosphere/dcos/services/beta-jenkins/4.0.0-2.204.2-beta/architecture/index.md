---
layout: layout.pug
navigationTitle:  Jenkins for DC/OS Service Architecture
title: Jenkins for DC/OS Service Architecture
menuWeight: 40
beta: true
excerpt: The Jenkins for DC/OS service bundles the Jenkins Automation Server with the Jenkins Mesos Plug-in. 
featureMaturity:
enterprise: false
---

## Overview

The Jenkins for DC/OS service bundles the [Jenkins Automation Server](https://github.com/jenkinsci/jenkins) with the [Jenkins Mesos Plug-in](https://github.com/jenkinsci/mesos-plugin) which lets users dispatch Jenkins jobs on a DC/OS cluster.

### Container Runtimes

#### Universal Container Runtime (UCR)

By default the Jenkins for DC/OS service uses the [Universal Container Runtime](https://docs.d2iq.com/mesosphere/dcos/latest/deploying-services/containerizers/ucr/) (UCR).

#### Docker

Previous version of the Jenkins for DC/OS service used the [Docker Engine](https://docs.d2iq.com/mesosphere/dcos/latest/deploying-services/containerizers/docker-containerizer/) as its default containerizer for both the Jenkins Master and the Agents. Users are recommended to use this runtime if they intend to ugprade from existing installations of the Jenkins service.

### Multi-tenancy

The Jenkins for DC/OS service starting with DC/OS 2.0 supports multi-tenancy. Users should familiarize themselves with [Quota](https://docs.d2iq.com/mesosphere/dcos/latest/multi-tenancy/quota-management/) and [Resource Managment Primitives](https://docs.d2iq.com/mesosphere/dcos/latest/multi-tenancy/resource-mgmt-primitives/) in DC/OS.
In particular, service-accounts in a quota enforced group must be given the correct role permissions for the service to launch and perform its operations.


### Hetergeneous Architecture with Windows Agents.

The Jenkins for DC/OS service starting with DC/OS 2.1 has support for Windows agents and as such the cluster has a heterogeneous architecture.
Windows agents in DC/OS 2.1 are required to have a [Mesos Attribute](http://mesos.apache.org/documentation/attributes-resources/) identifying them as Windows agents, currently this is set to `os:windows`.  The Jenkins scheduler uses the configuration option `offer-selection-attribute` to determine which offer belongs to a Windows or Linux agent.

There are few noteworthy constraints required to support Windows agents.

- **Jenkins Master**: The Jenkins master only runs on Linux agents. To prevent the Jenkins master from being deployed on Windows agents, the new configuration option `service.os-anti-affinity` was introduced. The affinity is exclusive. The default value of `windows` prevents Marathon from launching the Jenkins Master on any nodes with this Mesos attribute.
- **Linux Jenkins Agents**: The Jenkins Mesos scheduler applies the `linux` label via `jenkins-agent.linux-agent.label` to all Jenkins linux agents. Jenkins jobs intended to only be run on Linux agents should use this label such that they're only launched on the Linux Private Agent Pool.  
- **Windows Jenkins Agents**: The Jenkins Mesos scheduler applies the `windows` label via `jenkins-agent.windows-agent.label` to all Jenkins windows agents. Jenkins jobs intended to only be run on Windows agents should use this label such that they're only launched on the Windows Private Agent Pool.  

```
+--------------------------------------------------------------------------------------------+
|   DC/OS Cluster                                                                            |
|   +------------------------------------------------------------------------------------+   |
|   |                                                                                    |   |
|   |   Linux Public Agent Pool                                                          |   |
|   |                                                                                    |   |
|   |                                                                                    |   |
|   +------------------------------------------------------------------------------------+   |
|                                                                                            |
|   +-----------------------------------+        +---------------------------------------+   |
|   |                                   |        |                                       |   |
|   | Windows Private Agent Pool        |        | Linux Private Agent Pool              |   |
|   |                                   |        |                                       |   |
|   |                                   |        |                                       |   |
|   | +-------------------------------+ |        | +-----------------------------------+ |   |
|   | |Jenkins Windows Agents         | |        | | Jenkins Linux Agents              | |   |
|   | |                               | |        | |                                   | |   |
|   | |label: "os:windows"            | |        | |                                   | |   |
|   | |                               | |        | |                                   | |   |
|   | +-------------+-----------------+ |        | +----------------+------------------+ |   |
|   |               |                   |        |                  |                    |   |
|   |               |                   |        | +----------------v------------------+ |   |
|   |               |                   |        | | Jenkins Master                    | |   |
|   |               |                   |        | |                                   | |   |
|   |               +------------------------------>                                   | |   |
|   |                                   |        | |                                   | |   |
|   |                                   |        | +-----------------------------------+ |   |
|   |                                   |        |                                       |   |
|   +-----------------------------------+        +---------------------------------------+   |
+--------------------------------------------------------------------------------------------+
```
