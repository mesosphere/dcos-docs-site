---
layout: layout.pug
navigationTitle:
excerpt: Limitations
title: Limitations
menuWeight: 100
model: /services/kafka-zookeeper/data.yml
render: mustache
---

## Node Count

Only three or five ZooKeeper nodes are allowed. The value may not be changed after deployment.

## Updating ZooKeeper settings
Reconfiguration of certain ZooKeeper settings is not allowed after deployment:
- ticktime
- client port
- follower port
- leader election port

## Kerberos settings

Running Kerberized Apache ZooKeeper currently requires that principals be added to the shared keytab for the hostnames of the agents on which the nodes of the ZooKeeper ensemble are running as well as the DC/OS DNS addresses.

#include /mesosphere/dcos/services/include/limitations.tmpl
#include /mesosphere/dcos/services/include/limitations-zones.tmpl
#include /mesosphere/dcos/services/include/limitations-regions.tmpl
