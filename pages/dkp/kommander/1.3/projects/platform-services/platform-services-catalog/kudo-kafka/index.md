---
layout: layout.pug
navigationTitle: KUDO Kafka
render: mustache
title: KUDO Kafka
menuWeight: 3
excerpt: Day 2 Operations of KUDO Kafka
beta: false
---

<!-- markdownlint-disable MD018 -->
## KUDO Kafka

Kommander Catalog adds integration for [KUDO Kafka Operator](https://github.com/mesosphere/kudo-kafka-operator/), which simplifies day 2 operations of [Apache Kafka](https://kafka.apache.org/). 

#include /dkp/kommander/1.3/include/kudo-intro.tmpl

It is **strongly recommended** to view the [KUDO Kafka Documentation](https://kudo.dev/docs/runbooks/kafka/install.html) which covers the KUDO Kafka Operator in-depth. This document covers the integration aspects of KUDO Kafka Operator with D2iQ Kommander.

### Kommander Catalog

KUDO Kafka is located in the Kommander Catalog.   To access the catalog: 
#include /dkp/kommander/1.3/include/kommander-catalog-drilldown.tmpl

### Zookeeper

Apache Kafka has a dependency on [Apache Zookeeper](https://zookeeper.apache.org/). The Kommander Catalog includes [KUDO Zookeeper](/dkp/kommander/1.3/projects/platform-services/platform-services-catalog/kudo-zookeeper/) to be used in conjunction with KUDO Kafka.

### Installation

From the [Project Catalog](/dkp/kommander/1.3/projects/platform-services/) select the desired version of Kafka and click Deploy.

Below is an example of what should appear in the Kommander UI.  The dialog is populated with sensible defaults:

![Kafka Service Install Configuration](/dkp/kommander/1.3/img/platform-services-kafka-config-dialog.png)

- The **ID** field above is referred to as the Kafka `instance` by KUDO.
- [Detailed parameter descriptions](https://github.com/mesosphere/kudo-kafka-operator/blob/v2.5.1-1.3.3/operator/params.yaml) and defaults are available for each version of KUDO Kafka Operator, in this case version `2.5.1-1.3.3`

Select `Deploy` to install Kafka.

- Kommander will proceed to install `kudo-controller-manager` in the `kudo-system` namespace if it does not already exist. This is the equivalent of issuing `kubectl kudo init` manually on the CLI.
- KUDO will then install Kafka in the Project namespace created using Kommander.
- The deployment progression can be viewed by looking at the `deploy` plan.

### KUDO Kafka Service Status

The Operator Plan Status provides an overview of the service.

At this point it is useful to have an understanding of [KUDO Operator Plans](https://kudo.dev/docs/what-is-kudo.html#operator-plans) and the [KUDO CLI](https://kudo.dev/docs/cli/installation.html) should be installed.

- Get the instances running in the project namespace.

#include /dkp/kommander/1.3/include/kudo-kafka-instance.tmpl

- Get the Plan status from the KUDO Kafka Operator.

#include /dkp/kommander/1.3/include/kudo-kafka-plans.tmpl

- A `deploy` plan status of `COMPLETE` indicates that KUDO Kafka has deployed successfully and is healthy.

If any issues are encountered during the above, refer to the [Troubleshooting](#Troubleshooting) section.
