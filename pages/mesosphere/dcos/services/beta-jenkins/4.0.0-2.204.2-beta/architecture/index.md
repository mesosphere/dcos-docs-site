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

Jenkins for DC/OS runs as a root Marathon application inside a Docker container. The default Docker image contains several Jenkins plugins to get you up and running quickly. You can customize the Docker image to match your specific use case.

The Docker container also contains an NGINX reverse proxy that rewrites the URIs into the absolute paths Jenkins requires.

### Container Runtimes

#### Universal Container Runtime (UCR)

By default the Jenkins for DC/OS service uses the [Universal Container Runtime](https://docs.d2iq.com/mesosphere/dcos/latest/deploying-services/containerizers/ucr/) (UCR).

#### Docker

Previous version of the Jenkins for DC/OS service used the [Docker Engine](https://docs.d2iq.com/mesosphere/dcos/latest/deploying-services/containerizers/docker-containerizer/) as its default containerizer for both the Jenkins Master and the Agents. Users are recommended to use this runtime if they intend to ugprade from existing installations of the Jenkins service.

### Multi-tenancy

The Jenkins for DC/OS service starting with DC/OS 2.0 supports multi-tenancy. Users should familiarize themselves with [Quota](https://docs.d2iq.com/mesosphere/dcos/latest/multi-tenancy/quota-management/) and [Resource Managment Primitives](https://docs.d2iq.com/mesosphere/dcos/latest/multi-tenancy/resource-mgmt-primitives/) in DC/OS.
In particular, service-accounts in a quota enforced group must be given the correct role permissions for the service to launch and perform its operations.
