---
layout: layout.pug
navigationTitle: Percona XtraDB Cluster 0.2.0-5.7.21
title: Percona XtraDB Cluster 0.2.0-5.7.21
menuWeight: 50
excerpt: Overview of DC/OS Percona XtraDB Cluster 0.2.0-5.7.21
featureMaturity:
community: true
model: /services/pxc/data.yml
render: mustache
---

DC/OS {{ model.techName }} is an automated service that makes it easy to deploy and manage {{ model.techName }} on Mesosphere [DC/OS](https://mesosphere.com/product/). For more information on {{ model.techName }}, see the [{{ model.techName }} documentation](https://www.percona.com/software/mysql-database/percona-xtradb-cluster/).

<p class="message--warning"><strong>WARNING: </strong>This is a Community service. Community services are not tested for production environments. There may be bugs, incomplete features, incorrect documentation, or other discrepancies.</p>

## Benefits
DC/OS {{ model.techName }} offers the following benefits :
1. Designed for reliability
1. Easily configurable to support all {{ model.techName }} design patterns
1. Provides self health monitoring
1. Flexible design to suit design requirement (with/without SSL or PAM authentication)
1. Supports wide range of integration for data collection and persistence

DC/OS {{ model.techName }}'s main features are:
1. Synchronous replication model
1. Multi-master replication
1. True parallel replication
1. Automatic node provisioning
1. Data consistency
1. Configuration script for ProxySQL
1. Configuration of SSL encryption
