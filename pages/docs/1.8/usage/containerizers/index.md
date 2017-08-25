---
layout: layout.pug
title: Using Containerizers
menuWeight: 40
excerpt: ""
featureMaturity: ""
enterprise: 'no'
navigationTitle:  Using Containerizers
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


A containerizer is a Mesos agent component responsible for launching containers, within which you can run a service. Running services in containers offers a number of benefits, including the ability to isolate tasks from one another and control task resources programmatically.

DC/OS supports the Mesos containerizer types:

- The [original Mesos containerizer](/docs/1.8/usage/containerizers/mesos-containerizer/).

- The [DC/OS Universal Container Runtime](/docs/1.8/usage/containerizers/ucr/).

- The [Docker containerizer](/docs/1.8/usage/containerizers/docker-containerizer/).
