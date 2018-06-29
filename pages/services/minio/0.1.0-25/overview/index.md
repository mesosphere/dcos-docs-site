---
layout: layout.pug
navigationTitle: Overview
title: Overview
menuWeight: 10
excerpt: Getting started with DC/OS Minio Service fundamentals
featureMaturity:
enterprise: false
---

# Components

The following components work together to deploy and maintain the DC/OS Minio Service.

- Mesos

    
    Mesos is the foundation of the DC/OS cluster. Everything launched within the cluster is allocated resources and managed by Mesos. A typical Mesos cluster has one or three Masters that manage resources for the entire cluster. On DC/OS, the machines running the Mesos Masters will typically run other cluster services as well, such as Marathon and Cosmos, as local system processes. Separate from the Master machines are the Agent machines, which are where in-cluster processes are run. For more information on Mesos architecture, see the [Apache Mesos documentation](https://mesos.apache.org/documentation/latest/architecture/). For more information on DC/OS architecture, see the [DC/OS architecture documentation](https://docs.mesosphere.com/latest/overview/architecture/).
    
