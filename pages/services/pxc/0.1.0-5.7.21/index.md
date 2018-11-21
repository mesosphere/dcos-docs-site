---
layout: layout.pug
navigationTitle: Percona XtraDB Cluster 0.1.0-5.7.21
title: Percona XtraDB Cluster 0.1.0-5.7.21
menuWeight: 50
excerpt: DC/OS Percona XtraDB Cluster 0.1.0-5.7.21
featureMaturity:
enterprise: false
model: /services/pxc/data.yml
render: mustache
---

DC/OS {{ model.techName}} is an automated service that makes it easy to deploy and manage {{ model.techName}} on Mesosphere [DC/OS](https://mesosphere.com/product/). For more information on {{ model.techName}}, see the [Percona XtraDB Cluster documentation](https://www.percona.com/software/mysql-database/percona-xtradb-cluster/).

## Benefits
DC/OS {{ model.techName}} offers the following benefits:
1. Designed for reliability
2. Easily configurable to support all {{ model.techName}} design patterns
3. Provides self health monitoring
4. Flexible design to suit design requirement (with/without SSL or PAM authentication)
5. Supports wide range of integration for data collection and persistence

DC/OS {{ model.techName}}'s main features are:
1. Synchronous replication model
2. Multi-master replication
3. True parallel replication
4. Automatic node provisioning
5. Data consistency
6. Configuration script for ProxySQL
7. Configuration of SSL encryption
