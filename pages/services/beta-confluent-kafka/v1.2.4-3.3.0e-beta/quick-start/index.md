---
layout: layout.pug
navigationTitle: 
title: Quick Start
menuWeight: 10
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/confluent -->


1. Install DC/OS on your cluster. See [the documentation](/latest/administration/installing/) for instructions.

1.  If you are using open source DC/OS, install a Beta Confluent Kafka cluster with the following command from the DC/OS CLI. If you are using Enterprise DC/OS, you may need to follow additional instructions. See the Install and Customize section for more information.

```
dcos package install beta-confluent-kafka
```
<!-- stopped here -->
   Alternatively, you can install Beta Confluent Kafka from [the DC/OS web interface](/latest/usage/webinterface/).

Kafka will deploy with a default configuration. You can monitor deployment at the Services tab of the DC/OS web interface.

1. Connect a client to the service.
```
dcos beta-confluent-kafka endpoints --name=confluent-kafka
[
  "zookeeper",
  "broker"
]
```
```
dcos beta-confluent-kafka endpoints broker --name=confluent-kafka
{
  "address": [
    "10.0.1.161:1025",
    "10.0.1.6:1025",
    "10.0.3.205:1025"
  ],
  "dns": [
    "kafka-2-broker.kafka.autoip.dcos.thisdcos.directory:1025",
    "kafka-0-broker.kafka.autoip.dcos.thisdcos.directory:1025",
    "kafka-1-broker.kafka.autoip.dcos.thisdcos.directory:1025"
  ],
  "vip": "broker.kafka.l4lb.thisdcos.directory:9092"
}
```
