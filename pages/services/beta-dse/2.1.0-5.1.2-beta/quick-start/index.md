---
layout: layout.pug
navigationTitle:  Quick Start
title: Quick Start
menuWeight: 40
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/dse-private -->


```
$ dcos package install datastax-dse
$ dcos package install datastax-ops

$ dcos datastax-dse endpoints
[
  "spark-master-webui",
  "spark-worker-webui",
  "native-client",
  "solr-admin",
  "thrift-client"
]

$ dcos datastax-ops endpoints
[
  "opscenter"
]

$ dcos datastax-ops endpoints opscenter
{
  "address": ["10.200.177.79:8888"],
  "dns": ["opscenter-0-node.datastax-ops.autoip.dcos.thisdcos.directory:8888"]
}
... Open address in browser ...

$ dcos datastax-dse endpoints native-client
{
  "address": [
    "10.200.177.76:9042",
    "10.200.177.80:9042",
    "10.200.177.8:9042"
  ],
  "dns": [
    "dse-0-node.datastax-dse.autoip.dcos.thisdcos.directory:9042",
    "dse-1-node.datastax-dse.autoip.dcos.thisdcos.directory:9042",
    "dse-2-node.datastax-dse.autoip.dcos.thisdcos.directory:9042"
  ]
}
... Connect clients using this information ...
```
