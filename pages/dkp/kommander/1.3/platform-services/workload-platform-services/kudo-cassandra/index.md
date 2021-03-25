---
layout: layout.pug
navigationTitle: KUDO Cassandra
render: mustache
model: /dkp/kommander/1.3/data.yml
title: KUDO Cassandra
menuWeight: 3
excerpt: Day 2 Operations of KUDO Cassandra
beta: false
enterprise: false
---

<!-- markdownlint-disable MD018 -->

## Release Notes
The [Release Notes](#Release-Notes) section highlights any notable changes for each version.

## KUDO Cassandra

Kommander Catalog adds integration for [KUDO Cassandra Operator](https://github.com/kudobuilder/operators/tree/master/repository/cassandra/3.11), which simplifies day 2 operations of [Apache Cassandra](https://cassandra.apache.org/). 

#include /dkp/kommander/1.3/include/kudo-intro.tmpl

It is **strongly recommended** to view the [KUDO Cassandra Documentation](https://kudo.dev/docs/runbooks/cassandra/installing.html) which covers the KUDO Cassandra Operator in-depth. This document covers the integration aspects of KUDO Cassandra Operator with D2iQ Kommander.

### Kommander Catalog

KUDO Cassandra is located in the Kommander Catalog.
#include /dkp/kommander/1.3/include/kommander-catalog-drilldown.tmpl

### Installation

From the [Project Catalog](/dkp/kommander/1.3/projects/platform-services/) select the desired version of Cassandra and click Deploy.

Here is an example of what should appear in the Kommander UI, the dialog is populated with sensible defaults:

![Cassandra Service Install Configuration](/dkp/kommander/1.3/img/platform-services-cassandra-config-dialog.png)

- The **ID** field above is referred to as the Cassandra `instance` by KUDO.
- [Detailed parameter descriptions](https://github.com/mesosphere/kudo-cassandra-operator/blob/v3.11.7-1.0.3/operator/params.yaml) and defaults are availabe for each version of KUDO Cassandra Operator, in this case version `3.11.7-1`

Select `Deploy` to install Cassandra.

- Kommander will proceed to install `kudo-controller-manager` in the `kudo-system` namespace if it does not already exist. This is the equivalent of issuing `kubectl kudo init` manually on the CLI.
- KUDO will then install Cassandra in the Project namespace created via Kommander.
- The deployment progression can be viewed by looking at the `deploy` plan.

### KUDO Cassandra Service Status

The Operator Plan Status provides an overview of the service.

At this point its useful to have an understanding of [KUDO Operator Plans](https://kudo.dev/docs/what-is-kudo.html#operator-plans) and the [KUDO CLI](https://kudo.dev/docs/cli/installation.html) should be installed.

- Get the instances running in the project namespace.

#include /dkp/kommander/1.3/include/kudo-cassandra-instance.tmpl

- Get the Plan status from the KUDO Cassandra Operator.

#include /dkp/kommander/1.3/include/kudo-cassandra-plans.tmpl

- A `deploy` plan status of `COMPLETE` indicates that KUDO Cassandra has deployed successfully and is healthy.

If any issues are encountered during the above, the [Troubleshooting](#Troubleshooting) section has guidance.

### Parameter Updates

### Upgrades
### Monitoring
### External Access
### Backup & Repair
### Decommissioning
### Troubleshooting