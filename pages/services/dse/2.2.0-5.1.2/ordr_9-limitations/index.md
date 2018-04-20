---
layout: layout.pug
navigationTitle:
excerpt:
title: Limitations
menuWeight: 100
model: /services/dse/data.yml
render: mustache
---

#include /services/include/limitations.tmpl
#include /services/include/limitations-zones.tmpl

## Service Limits
- Multiple DSE Instances on a host is not supported in production.
- Stopping or restarting a DSE node from OpsCenter is not supported. Use `dcos pod restart` to restart DSE nodes from the DC/OS CLI.
- A single OpsCenter cannot manage multiple DSE clusters, but can manage multiple DCs in the same cluster.
- A DSE node will restart if its associated DSE Agent process crashes.
- Point-in-time restore functionality through the OpsCenter UI is not supported.

## Automatic failed node recovery

A manual `nodetool removenode` call is currently required when replacing nodes. This is planned to be automated in a future release.

Nodes are not automatically replaced by the service in the event a system goes down. You may either manually replace nodes or build your own ruleset and automation to perform this operation automatically.

## Rack-aware replication

Rack awareness within the DC/OS DSE Service is not currently supported, but is planned to be supported with a future release of DC/OS.
