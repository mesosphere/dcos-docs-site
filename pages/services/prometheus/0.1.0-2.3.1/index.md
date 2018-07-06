---
layout: layout.pug
navigationTitle: Prometheus 0.1.0-2.3.1
title: Prometheus 0.1.0-2.3.1
menuWeight: 50
excerpt: Overview of DC/OS Prometheus 0.1.0-2.3.1
featureMaturity:
enterprise: false
---

Prometheus is monitoring and alerting toolkit which accepts data in the form of timeseries data base.
Prometheus works well for recording any purely numeric time series. It fits both machine-centric monitoring as well as monitoring of highly dynamic service-oriented architectures.

To monitor your services using Prometheus, your services need to expose a Prometheus endpoint. This endpoint is a HTTP interface that exposes a list of metrics and the current value of the metrics.

Prometheus has a wide range of service discovery options to find your services and start retrieving metric data from them. The Prometheus server polls the metrics interface on your services and stores the data.

In the Prometheus UI, you can write queries in the PromQL language to extract metric information.

For example:

topk(3, sum(rate(container_cpu_time[5m]) by (app, proc)))

will return the top 3 most CPU consuming services.

DC/OS Prometheus Service is an automated service that makes it easy to deploy and manage Prometheus on Mesosphere [DC/OS](https://mesosphere.com/product/), eliminating nearly all complexities, that are traditionally associated with managing a cluster of Prometheus nodes.

## Benefits
DC/OS Prometheus  offers the following benefits of a semi-managed service:
1. Prometheus is designed for reliability, to be the system you go to during an outage to allow you to quickly diagnose problems
2. Each Prometheus server is standalone, not depending on network storage or other remote services. You can rely on it when other parts of your infrastructure are broken, and you do not need to setup extensive infrastructure to use it.
3. 



DC/OS Prometheus's main features are:
1. Multi-dimensional data model with time series data identified by metric name and key/value pairs
2. Flexible query language to leverage this dimensionality
3. No reliance on distributed storage; single server nodes are autonomous
4. Time series collection happens via a pull model over HTTP
5. Targets are discovered via service discovery or static configuration
6. Multiple modes of graphing and dashboarding support



