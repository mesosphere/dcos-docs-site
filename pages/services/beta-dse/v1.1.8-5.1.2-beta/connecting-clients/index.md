---
layout: layout.pug
navigationTitle:  Connecting Clients
title: Connecting Clients
menuWeight: 40
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/dse-private -->


1. [Use `dcos tunnel vpn` to connect](/1.8/administration/access-node/tunnel/) (only needed if the DC/OS nodes are not directly reachable from your local machine).
1. Find endpoints
```bash
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
```

In this example, you can access the Opscenter UI directly via the native endpoints in your local browser at `10.0.3.156:8888` or `opscenter-0-node.dse.mesos:8888`.

Retrieve other endpoints via `dcos dse endpoints <pod-name>`. Use the output of this command to access them via your local browser.

![OpsCenter via tunnel](/services/beta-dse/v1.1.8-5.1.2-beta/img/screenshot.jpg?raw=true "OpsCenter")
