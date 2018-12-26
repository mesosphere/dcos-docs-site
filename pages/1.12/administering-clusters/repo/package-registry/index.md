---
layout: layout.pug
navigationTitle: Package Registry
title: Package Registry
menuWeight: 1001
excerpt: Understanding the package registry and its limitations
enterprise: true
---

The DC/OS Package Registry is a service for packaging, distributing, storing and delivering DC/OS Package for DC/OS. A DC/OS Package is a self-contained file which contains everything needed to run a DC/OS Service. This includes metadata information, configuration information, general resources and Docker images required by the DC/OS Service.

# Enabled operations

This service allows you to run DC/OS Services by storing DC/OS Packages local to the cluster. This allows you to perform the following operations:

- Operating a fully air-gapped cluster
- Deploying DC/OS Services using intranet latency and bandwidth
- Managing DC/OS Packages individually with the ability to add new packages and upgrade individual services incrementally


# Limitations

- Inability to change storage back end after initial deployment
- Multiple DC/OS clusters with a single DC/OS Package Registry
- Metrics for local storage (S3 metrics are out of scope). For example, alerts on low disk space are not implemented yet.

<p class="message--note"><strong>NOTE: </strong>Package registry v0.2.1 is supported for DC/OS 1.12.1 and above.</p>