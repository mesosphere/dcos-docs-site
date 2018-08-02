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

[<img src="/services/couchbase/0.1.1-5.1.0/img/couchbase_install.png" alt="Couchbase Install"/>](/services/couchbase/0.1.1-5.1.0/img/couchbase_install.png)

In either case a default cluster will only come up with two data nodes. You need to change the configuration to also bring up index, query and full text search nodes.

For a couchbase cluster with 2 data node, 1 index node, 1 query node, and 1 full text search node you need a dc/os cluster with 5 private agents.

## Accessing the Console

Once the framework is up and running:
1. Install Edge-LB.
2. Create a file named `couchbase-edgelb.json` containing the following `edge-lb` configuration:

```
<TBD>
```

3. In your browser enter the following address.

Couchbase UI:
```
http://<public-agent-ip>:8091
```
When prompted for credentials enter Administrator / password.

[<img src="/services/couchbase/0.1.1-5.1.0/img/prom_dashboard.png" alt="Couchbase Dashboard"/>](/services/couchbase/0.1.1-5.1.0/img/couchbase_cred.png)

