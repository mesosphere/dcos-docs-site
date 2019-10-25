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

By default the DC/OS Jenkins service uses the [Docker Engine](../../../../2.0/deploying-services/containerizers/docker-containerizer/index.md) as its default containerizer for both the Jenkins Master and the Agents. Users are recommended to use this runtime if they intend to ugprade from existing installations of the Jenkins service.

#### Universal Container Runtime (UCR)

The [Universal Container Runtime](../../../../2.0/deploying-services/containerizers/ucr/index.md) (UCR) is optionally supported on the Jenkins Master. UCR is available as the containerizer on the Jenkins agents but its use is opt-in and not supported at this time.

### Multi-tenancy

The DC/OS Jenkins service starting with DC/OS 2.0 supports multi-tenancy. Users should familiarize themselves with [Quota](../../../../2.0/multi-tenancy/quota-management/index.md) and [Resource Managment Primitives](../../../../2.0/multi-tenancy/resource-mgmt-primitives/index.md) in DC/OS.
In particular, service-accounts in a quota enforced group must be given the correct role permissions for the service to launch and perform its operations.