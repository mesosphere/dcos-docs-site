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

DC/OS {{ model.techName }} Service is an automated service that makes it easy to deploy and manage {{ model.techName }} on Mesosphere [DC/OS](https://mesosphere.com/product/). For more information on MongoDB, see the [MongoDB documentation](https://docs.mongodb.com/).

## Benefits
DC/OS {{ model.techName }} offers the following benefits:
1. Based on the battle-proven DC/OS framework/operator SDK underpinning all DC/OS-certified frameworks.
2. MongoDB is an open-source document database.
3. MongoDB provides high performance, high availability, and automatic scaling.

## DC/OS {{ model.techName }}'s main features are:
1. High Performance: MongoDB Support for embedded data models reduces I/O activity on database system.Indexes support faster queries and can include keys from embedded documents and arrays.
2. Rich Query Language: MongoDB support read and write operations, Data Aggregation, Text Search and Geospatial Queries.
3. High Availability: MongoDB’s replication facility, called replica set, provides automatic failover and data redundancy.
4. Horizontal Scalability: MongoDB provides horizontal scalability as part of its core functionality. Sharding distributes data across a cluster of machines. MongoDB supports creating zones of data based on the shard key. In a balanced cluster, MongoDB directs reads and writes covered by a zone only to those shards inside the zone.
5. Multiple Storage Engine: MongoDB supports multiple storage engines such as WiredTiger Storage Engine (including support for Encryption at Rest), In-Memory Storage Engine, MMAPv1 Storage Engine.
6. MongoDB provides pluggable storage engine API that allows third parties to develop storage engines for MongoDB.

## Dynamic Scaling Out

MongoDB support horizontal scaling i.e., if workload increases it divides the system dataset and load over multiple servers, adding additional servers to increase capacity as required.
MongoDB also support Vertical scaling i.e., if workload increases it increase the capacity of a single server, such as using a more powerful CPU, adding more RAM, or increasing the amount of storage space.

