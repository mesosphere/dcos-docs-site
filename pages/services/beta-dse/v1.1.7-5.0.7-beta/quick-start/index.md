---
layout: layout.pug
navigationTitle:  Quick Start
title: Quick Start
menuWeight: 10
excerpt:
featureMaturity:
enterprise: false
---

```
$ dcos package install dse

$ dcos dse endpoints
[
  "studio",
  "spark-master-webui",
  "spark-worker-webui",
  "opscenter",
  "cassandra-native",
  "solr-admin",
  "cassandra-thrift"
]

$ dcos dse endpoints opscenter
{
  "address": ["10.0.3.156:8888"],
  "dns": ["opscenter-0-node.dse.mesos:8888"]
}
... Open address in browser ...

$ dcos dse endpoints cassandra-native
{
  "address": ["10.0.3.164:9042", "10.0.3.184:9042", "10.0.3.132:9042"],
  "dns": ["dse-0-node.dse.mesos:9042", "dse-1-node.dse.mesos:9042", "dse-2-node.dse.mesos:9042"]
}
... Connect clients using this information ...
```
