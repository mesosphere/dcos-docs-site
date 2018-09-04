---
layout: layout.pug
navigationTitle: Package Registry
title: Package Registry
menuWeight: 1001
excerpt: DC/OS Package Registry packages, distributes, stores, and delivers DC/OS Packages on DC/OS
beta: true
enterprise: true
---

DC/OS Package Registry is a service for packaging, distributing, storing and delivering DC/OS Package for DC/OS. A DC/OS Package is a self-contained file which contains everything needed to run a DC/OS Service. This includes metadata information, configuration information, general resources and Docker images required by the DC/OS Service.

This service allows users to run DC/OS Services by storing DC/OS Packages local to the cluster. This enable to following use cases:

- Operating a fully air-gapped cluster

- Deploying DC/OS Services using intranet latency and bandwidth

- Managing DC/OS Packages individually with the ability to add new packages and upgrade individual services incrementally
git
