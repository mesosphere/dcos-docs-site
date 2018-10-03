---
layout: layout.pug
navigationTitle:  Managing
title: Managing
menuWeight: 40
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/confluent -->


# Updating Configuration
You can make changes to the service after it has been launched. Configuration management is handled by the scheduler process, which in turn handles deploying Confluent Kafka itself.

Edit the runtime environment of the scheduler to make configuration changes. After making a change, the scheduler will be restarted and automatically deploy any detected changes to the service.

Some changes, such as decreasing the number of brokers or changing volume requirements, are not supported after initial deployment. See [Limitations](/services/confluent-kafka/v2.0.0.1-3.3.0e/limitations/).

To see a full list of available options, run `dcos package describe --config confluent-kafka` in the CLI, or browse the Confluent Kafka install dialog in the DC/OS web interface.

## Adding a Node
The service deploys `BROKER_COUNT` tasks by default. This can be customized at initial deployment or after the cluster is running. Shrinking the cluster is not supported.

## Resizing a Node
The CPU and Memory requirements of each broker can be increased or decreased as follows:
- CPU (1.0 = 1 core): `BROKER_CPUS`
- Memory (in MB): `BROKER_MEM`

**Note:** Volume requirements (type and/or size) cannot be changed after initial deployment.

## Updating Placement Constraints

Placement constraints can be updated after initial deployment using the following procedure. See [Service Settings](#service-settings) for more information on placement constraints.

Let's say we have the following deployment of our brokers:

- Placement constraint of: `hostname:LIKE:10.0.10.3|10.0.10.8|10.0.10.26|10.0.10.28|10.0.10.84`
- Tasks:
```
10.0.10.3: kafka-0
10.0.10.8: kafka-1
10.0.10.26: kafka-2
10.0.10.28: empty
10.0.10.84: empty
```

`10.0.10.8` is being decommissioned and we should move away from it. Steps:

1. Remove the decommissioned IP and add a new IP to the placement rule whitelist by editing `PLACEMENT_CONSTRAINT`:

	```
	hostname:LIKE:10.0.10.3|10.0.10.26|10.0.10.28|10.0.10.84|10.0.10.123
	```

# Restarting brokers

This operation will restart a broker while keeping it at its current location and with its current persistent volume data. This may be thought of as similar to restarting a system process, but it also deletes any data that is not on a persistent volume.

1. Run `dcos confluent-kafka pods restart kafka-0 --name=confluent-kafka`
