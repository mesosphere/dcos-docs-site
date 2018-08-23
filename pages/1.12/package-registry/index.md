---
layout: layout.pug
navigationTitle: DC/OS Package Registry
title: DC/OS Package Registry
menuWeight: 1
excerpt: DC/OS Package Registry packages, distributes, stores, and delivers DC/OS Packages on DC/OS
beta: true
enterprise: true
---

The DC/OS Package Registry is a service for packaging, distributing, storing and delivering DC/OS Package for DC/OS. A DC/OS Package is a self-contained file which contains everything needed to run a DC/OS Service. This includes metadata information, configuration information, general resources and Docker images required by the DC/OS Service.

This service allows users to run DC/OS Services by storing DC/OS Packages local to the cluster. This enable to following use cases:

    - Ability to operate a fully air-gapped cluster.

    - Deploy DC/OS Service using intranet latency and bandwidth.

    - Manage DC/OS Package individually and allowing to incrementally add new packages and upgrade individual services.
