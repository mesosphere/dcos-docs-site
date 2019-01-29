---
layout: layout.pug
navigationTitle: HDFS 2.5.0-2.6.0-cdh5.11.0
excerpt: HFDS is a managed service that makes it easy to deply and manage clusters on DC/OS
title: HDFS 2.5.0-2.6.0-cdh5.11.0
menuWeight: 9
model: /services/hdfs/data.yml
render: mustache
---

Welcome to the documentation for DC/OS {{ model.techName }}. DC/OS {{ model.techName }} is a managed service that makes it easy to deploy and manage an HA (High Availability) {{ model.techName }} cluster on Mesosphere DC/OS. [{{ model.techName }}](http://hadoop.apache.org/) (Hadoop Distributed File System) is an open source distributed file system based on Google's GFS (Google File System) paper. It is a replicated and distributed file system interface for use with "big data" and "fast data" applications.

## Benefits

DC/OS {{ model.techName }} offers the following benefits:

- Easy installation
- Multiple {{ model.techName }} clusters
- Elastic scaling of data nodes
- Integrated monitoring

## Features

DC/OS {{ model.techName }} provides the following features:

- Single-command installation for rapid provisioning
- Persistent storage volumes for enhanced data durability
- Runtime configuration and software updates for high availability
- Health checks and metrics for monitoring
- Distributed storage scale out
- HA name service with Quorum Journaling and ZooKeeper failure detection

## Related Services

- [DC/OS Spark](/services/spark/)
