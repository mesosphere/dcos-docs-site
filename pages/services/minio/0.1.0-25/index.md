---
layout: layout.pug
navigationTitle: Minio 0.1.0-25
title: Minio 0.1.0-25
menuWeight: 50
excerpt: Overview of DC/OS Minio 0.1.0-25
featureMaturity:
enterprise: false
---

DC/OS Minio Service is an automated service that makes it easy to deploy and manage Minio on Mesosphere [DC/OS](https://mesosphere.com/product/). For more information on Minio, see the [Minio documentation](https://docs.minio.io/).

## Benefits
DC/OS Minio offers the following benefits :
1. Designed for reliability
2. Easily configurable to support all Minio design patterns
3. Auto self health monitoring with provision for corrective action
4. Flexible design to suit design requirement (with/without Alertmanager)
5. Supports wide range of integration for data collection,persistence, notification and dashboarding

DC/OS Minio's main features are:
1. Multi-dimensional data model with time series data identified by metric name and key/value pairs
2. Flexible query language to leverage this dimensionality
3. No reliance on distributed storage; single server nodes are autonomous
4. Time series collection happens via a pull model over HTTP
5. Targets are discovered via service discovery or static configuration
6. Multiple modes of graphing and dashboarding support
