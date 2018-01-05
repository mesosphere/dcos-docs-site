---
layout: layout.pug
navigationTitle:  Connecting Clients
title: Connecting Clients
menuWeight: 50
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/dse-private -->


1. [Use `dcos tunnel vpn` to connect](https://docs.mesosphere.com/1.8/administration/access-node/tunnel/) (only needed if the DC/OS nodes are not directly reachable from your local machine).
1. Find endpoints
```bash
$ dcos datastax-dse endpoints
[
  "spark-master-webui",
  "spark-worker-webui",
  "opscenter",
  "native-client",
  "solr-admin",
  "thrift-client"
]

$ dcos datastax-ops endpoints opscenter
{
  "address": ["10.0.3.156:8888"],
  "dns": ["opscenter-0-node.datastax-ops.autoip.dcos.thisdcos.directory:8888"]
}
```

In this example, you can access the Opscenter UI directly via the native endpoints in your local browser at `10.0.3.156:8888` or `opscenter-0-node.datastax-ops.autoip.dcos.thisdcos.directory:8888`.

Retrieve other endpoints via `dcos datastax-dse endpoints <pod-name>`. Use the output of this command to access them via your local browser.

![OpsCenter via tunnel](/img/screenshot.jpg?raw=true "OpsCenter")
