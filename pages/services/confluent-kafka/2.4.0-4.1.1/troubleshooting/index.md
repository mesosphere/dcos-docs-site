---
layout: layout.pug
navigationTitle: Troubleshooting 
excerpt: Troubleshooting Confluent Kafka
title: Troubleshooting Confluent Kafka
menuWeight: 170
model: /services/confluent-kafka/data.yml
render: mustache
---

#include /services/include/troubleshooting.tmpl

## Partition replication

{{ model.techShortName }} may become unhealthy when it detects any underreplicated partitions. This error condition usually indicates a malfunctioning broker. Use the `dcos {{ model.packageName }} --name={{ model.serviceName }} topic under_replicated_partitions` and `dcos {{ model.packageName }} --name={{ model.serviceName }} topic describe <topic-name>` commands to find the problem broker and determine what actions are required.

Possible repair actions include [restarting the affected broker](#restarting-a-node) and [destructively replacing the affected broker](#replacing-a-permanently-failed-node). The replace operation is destructive and will irrevocably lose all data associated with the broker. The restart operation is not destructive and indicates an attempt to restart a broker process.


## Broker Shutdown

If the {{ model.techShortName }} brokers are not completing the clean shutdown within the configured
`brokers.kill_grace_period` (Kill Grace Period), extend the Kill Grace Period.
