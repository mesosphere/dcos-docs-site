---
layout: layout.pug
navigationTitle: MongoDB 0.1.0-4.0.3
title: MongoDB 0.1.0-4.0.3
menuWeight: 50
excerpt: Documentation for DC/OS MongoDB 0.1.0-4.0.3
model: /services/mongodb-enterprise/data.yml
render: mustache
featureMaturity:
enterprise: false
---

DC/OS {{ model.techName }} Service is an automated service that makes it easy to deploy and manage {{ model.techName }} on Mesosphere [DC/OS](https://mesosphere.com/product/). For more information on {{ model.techName }}, see the [{{ model.techName }} documentation](https://docs.mongodb.com/).

## Benefits
DC/OS {{ model.techName }} offers the following benefits:
1. Based on the proven DC/OS framework/operator SDK underpinning all DC/OS-certified frameworks.
2. {{ model.techName }} is an open-source document database.
3. {{ model.techName }} provides high performance, high availability, and automatic scaling.

## DC/OS {{ model.techName }}'s main features are:
1. **High Performance:** {{ model.techName }} Support for embedded data models reduces I/O activity on database system. Indexes support faster queries and can include keys from embedded documents and arrays.

1. **Rich Query Language:** {{ model.techName }} supports read and write operations, data aggregation, text search and geospatial queries.

1. **High Availability:** {{ model.techName }}’s replication facility, called replica set, provides automatic failover and data redundancy.

1. **Horizontal Scalability:** {{ model.techName }} provides horizontal scalability as part of its core functionality. Sharding distributes data across a cluster of machines. {{ model.techName }} supports creating zones of data based on the shard key. In a balanced cluster, {{ model.techName }} directs reads and writes covered by a zone only to those shards inside the zone.

1. **Multiple Storage Engine:** {{ model.techName }} supports multiple storage engines such as WiredTiger Storage Engine (including support for Encryption at Rest), In-Memory Storage Engine, and MMAPv1 Storage Engine.

1. **Storage Engine API:** {{ model.techName }} provides a pluggable storage engine API that allows third parties to develop storage engines for {{ model.techName }}.

## Dynamic Scaling Out

{{ model.techName }} supports horizontal scaling; that is, if its workload increases, {{ model.techName }} divides the system dataset and load over multiple servers, adding additional servers to increase capacity as required.
{{ model.techName }} also supports vertical scaling; that is, if its workload increases, {{ model.techName }} increases the capacity of a single server, by using a more powerful CPU, adding more RAM, or increasing the amount of storage space.

