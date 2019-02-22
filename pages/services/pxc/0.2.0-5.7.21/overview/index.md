---
layout: layout.pug
navigationTitle:  Overview
title: Overview
menuWeight: 15
excerpt: Features of the Percona XtraDB Cluster on DC/OS
featureMaturity:
enterprise: false
model: /services/pxc/data.yml
render: mustache
---

DC/OS {{model.techName }} Service is an automated service that makes it easy to deploy and manage {{model.techName }} on Mesosphere [DC/OS](https://mesosphere.com/product/). For more information on {{model.techName }}, see the [{{model.techName }} documentation](https://www.percona.com/software/mysql-database/percona-xtradb-cluster/).

## Benefits
DC/OS {{ model.techName }} offers the following benefits :
1. Designed for reliability
1. Easily configurable to support all {{ model.techName }} design patterns
1. Provides self health monitoring
1. Flexible design to suit design requirement (with/without SSL or PAM authentication)
1. Supports wide range of integration for data collection and persistence
1. Provides backup and restore faciltity on AWS compatible storages.
1. Provides Data at rest encryption facility to store data in a secure manner.

## Features
DC/OS {{ model.techName }}'s main features are:
1. Synchronous replication model
1. Multi-master replication
1. True parallel replication
1. Automatic node provisioning
1. Data consistency
1. Configuration script for ProxySQL
1. Configuration of SSL encryption
