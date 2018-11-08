---
layout: layout.pug
navigationTitle: Limitations of DSE
excerpt: Limitations of DC/OS DSE
title: Limitations of DSE
menuWeight: 100
model: /services/dse/data.yml
render: mustache
---

#include /services/include/limitations.tmpl
#include /services/include/limitations-zones.tmpl

## Service Limits
- Multiple {{ model.shortTechName }} instances on a host is not supported in production.
- Stopping or restarting a {{ model.shortTechName }} node from OpsCenter is not supported. Use `dcos pod restart` to restart {{ model.shortTechName }} nodes from the DC/OS CLI.
- A single OpsCenter cannot manage multiple {{ model.shortTechName }} clusters, but can manage multiple DCs in the same cluster.
- A {{ model.shortTechName }} node will restart if its associated {{ model.shortTechName }} Agent process crashes.
- Point-in-time restore functionality through the OpsCenter UI is not supported.

## Automatic failed node recovery

A manual `nodetool removenode` call is currently required when replacing nodes. This is planned to be automated in a future release.

Nodes are not automatically replaced by the service in the event a system goes down. You may either manually replace nodes or build your own ruleset and automation to perform this operation automatically.

## Rack-aware replication

Rack awareness within the DC/OS {{ model.shortTechName }} Service is not currently supported, but is planned to be supported with a future release of DC/OS.
