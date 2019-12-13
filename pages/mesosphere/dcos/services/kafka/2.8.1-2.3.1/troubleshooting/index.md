---
layout: layout.pug
navigationTitle:
excerpt: Diagnosing Kafka
title: Troubleshooting
menuWeight: 70
model: /mesosphere/dcos/services/kafka/data.yml
render: mustache
---

#include /mesosphere/dcos/services/include/troubleshooting.tmpl

## Partition replication

{{ model.techShortName }} may become unhealthy when it detects any underreplicated partitions. This error condition usually indicates a malfunctioning broker. Use the `dcos {{ model.packageName }} --name={{ model.serviceName }} topic under_replicated_partitions` and `dcos {{ model.packageName }} --name={{ model.serviceName }} topic describe <topic-name>` commands to find the problem broker and determine what actions are required.

Possible repair actions include [restarting the affected broker](#restarting-a-node) and [destructively replacing the affected broker](#replacing-a-permanently-failed-node). The `replace` operation is destructive and will irrevocably lose all data associated with the broker. The `restart` operation is not destructive and indicates an attempt to restart a broker process.


## Broker Shutdown

If the {{ model.techShortName }} brokers do not complete the clean shutdown within the configured
`brokers.kill_grace_period` (Kill Grace Period), extend the Kill Grace Period.
