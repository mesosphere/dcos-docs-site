---
layout: layout.pug
navigationTitle: Quick Start
excerpt: Configuring Couchbase - Quick Start
title: Quick Start
menuWeight: 15
---

# How to use Couchbase with DC/OS

## Prerequisites

* A running DC/OS 1.11 cluster

## Install

Couchbase can be installed via either the DC/OS Catalog web interface or by using the CLI. The following command will launch the install via the DC/OS CLI:

```bash
dcos package install Couchbase 
```

[<img src="/services/couchbase/0.1.0-5.1.0/img/couchbase_install.png" alt="Couchbase Install"/>](/services/couchbase/0.1.0-5.1.0/img/couchbase_install.png)

In either case a default cluster will only come up with two data nodes. You need to change the configuration to also bring up index, query and full text search nodes.

For a couchbase cluster with 2 data node, 1 index node, 1 query node, and 1 full text search node you need a dc/os cluster with 5 private agents.

## Accessing the Console
Once the cluster is up and running use the following command to get the mesos-id of the host running one of the data nodes.

$ dcos node
Using the mesos-id create a ssh localhost tunnel.

$ dcos node ssh --master-proxy --mesos-id=... --option LocalForward=8091=localhost:8091
Now go to your browser and enter localhost:8091. When prompted for credentials enter Administrator / password.
