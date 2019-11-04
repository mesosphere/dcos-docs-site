---
layout: layout.pug
navigationTitle:  Jenkins Service Architecture
title: Jenkins Service Architecture
menuWeight: 40
excerpt:
featureMaturity:
enterprise: false
---

## Overview

The DC/OS Jenkins service bundles the [Jenkins Automation Server](https://github.com/jenkinsci/jenkins) with the [Jenkins Mesos Plugin](https://github.com/jenkinsci/mesos-plugin) which lets users dispatch Jenkins jobs on a DC/OS Cluster.

### Container Runtimes

#### Docker

By default the DC/OS Jenkins service uses the [Docker Engine](https://docs.d2iq.com/mesosphere/dcos/latest/deploying-services/containerizers/docker-containerizer/) as its default containerizer for both the Jenkins Master and the Agents. Users are recommended to use this runtime if they intend to ugprade from existing installations of the Jenkins service.

#### Universal Container Runtime (UCR)

The [Universal Container Runtime](https://docs.d2iq.com/mesosphere/dcos/latest/deploying-services/containerizers/ucr/) (UCR) is optionally supported on the Jenkins Master. UCR is available as the containerizer on the Jenkins agents but its use is opt-in and not supported at this time.

### Multi-tenancy

The DC/OS Jenkins service starting with DC/OS 2.0 supports multi-tenancy. Users should familiarize themselves with [Quota](https://docs.d2iq.com/mesosphere/dcos/latest/multi-tenancy/quota-management/) and [Resource Managment Primitives](https://docs.d2iq.com/mesosphere/dcos/latest/multi-tenancy/resource-mgmt-primitives/) in DC/OS.
In particular, service-accounts in a quota enforced group must be given the correct role permissions for the service to launch and perform its operations.
