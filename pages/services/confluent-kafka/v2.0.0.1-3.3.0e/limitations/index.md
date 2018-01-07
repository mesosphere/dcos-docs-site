---
layout: layout.pug
navigationTitle:  Limitations
title: Limitations
menuWeight: 50
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/confluent -->


- Shrinking cluster size (number of brokers) is not supported.


## Automatic Failed Node Recovery

Nodes are not automatically replaced by the service in the event a system goes down. You can either manually replace pods as described under [Managing](/services/confluent-kafka/v2.0.0.1-3.3.0e/managing/)), or build your own ruleset and automation to perform this operation automatically.

## Updating Storage Volumes

Neither volume type nor volume size requirements can be changed after initial deployment.

## Rack-aware Replication

Rack awareness within the service is not currently supported, but is planned to be supported with a future release of DC/OS.

## Automatic Data Balancing

Automatic Data Balancing is not supported at this time.
