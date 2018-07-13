---
layout: layout.pug
navigationTitle: Prometheus 0.1.0-2.3.1
title: Prometheus 0.1.0-2.3.1
menuWeight: 50
excerpt: Overview of DC/OS Prometheus 0.1.0-2.3.1
featureMaturity:
enterprise: false
---

DC/OS Prometheus Service is an automated service that makes it easy to deploy and manage Prometheus on Mesosphere [DC/OS](https://mesosphere.com/product/). For more information on Prometheus, see Prometheus documentation https://docs.mesosphere.com/services/prometheus/0.1.0-2.3.1/

## Benefits
DC/OS Prometheus offers the following benefits :
1. DC/OS Prometheus framework is designed for reliability 
2. DC/OS Prometheus does not depend on any external storage,each Prometheus server is standalone, not depending on network storage or other remote services. You can rely on it when other parts of your infrastructure are broken, and you do not need to setup extensive infrastructure to use it.
3. DC/OS Prometheus will help continuously monitor your applications and servers for application exceptions, server CPU & memory usage, or storage spikes 
4. DC/OS Prometheus can fire alerts and can send notification to slack,email,pagerduty etc,if CPU or memory usage goes up for a certain period of time or a service of your application stops responding so you can perform appropriate actions against those failures or exceptions. 
5. DC/OS Prometheus by default monitors agent nodes of cluster and addtionally provides service discovery mechanism (DNS,EC2 etc) for monitoring targets
6. DC/OS Prometheus dcos provides high availability of prometheus server and alert manager components. 
7. DC/OS Prometheus provides horizontal scaling
8. DC/OS Prometheus gives you benifits to integrate with grafana for dashboarding purpose
9. DC/OS Prometheus provides you flexibility to store your data remotely to remote DB like influx DB(which accepts time series data).
 
DC/OS Prometheus's main features are:
1. Multi-dimensional data model with time series data identified by metric name and key/value pairs
2. Flexible query language to leverage this dimensionality
3. No reliance on distributed storage; single server nodes are autonomous
4. Time series collection happens via a pull model over HTTP
5. Targets are discovered via service discovery or static configuration
6. Multiple modes of graphing and dashboarding support



