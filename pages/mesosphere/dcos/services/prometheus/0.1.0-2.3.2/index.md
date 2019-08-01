---
layout: layout.pug
navigationTitle: Prometheus 0.1.0-2.3.2
title: Prometheus 0.1.0-2.3.2
menuWeight: 2
excerpt: Overview of DC/OS Prometheus 0.1.0-2.3.2
featureMaturity:
community: true
---

DC/OS Prometheus Service is an automated service that makes it easy to deploy and manage Prometheus on Mesosphere [DC/OS](https://mesosphere.com/product/). For more information on Prometheus, see the [Prometheus documentation](https://prometheus.io/docs/introduction/overview/).

<p class="message--warning"><strong>WARNING: </strong>This is a Community service. Community services are not tested for production environments. There may be bugs, incomplete features, incorrect documentation, or other discrepancies.</p>

## Benefits
DC/OS Prometheus offers the following benefits :
1. Designed for reliability
2. Easily configurable to support all Prometheus design patterns
3. Auto self health monitoring with provision for corrective action
4. Flexible design to suit design requirement (with/without Alertmanager)
5. Supports wide range of integration for data collection,persistence, notification and dashboarding

DC/OS Prometheus's main features are:
1. Multi-dimensional data model with time series data identified by metric name and key/value pairs
2. Flexible query language to leverage this dimensionality
3. No reliance on distributed storage; single server nodes are autonomous
4. Time series collection happens via a pull model over HTTP
5. Targets are discovered via service discovery or static configuration
6. Multiple modes of graphing and dashboarding support
