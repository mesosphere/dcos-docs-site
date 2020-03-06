---
layout: layout.pug
navigationTitle: Limitations
excerpt: Limitations of DC/OS DSE
title: Limitations
menuWeight: 100
model: /mesosphere/dcos/services/dse/data.yml
render: mustache
---

#include /mesosphere/dcos/services/include/limitations.tmpl
#include /mesosphere/dcos/services/include/limitations-zones.tmpl

## Service Limits
- Multiple {{ model.shortTechName }} instances on a host are not supported in production.
- Stopping or restarting a {{ model.shortTechName }} node from {{ model.techOpsName }} is not supported. Use `dcos pod restart` to restart {{ model.shortTechName }} nodes from the DC/OS CLI.
- A single {{ model.techOpsName }} cannot manage multiple {{ model.shortTechName }} clusters, but can manage multiple DCs in the same cluster.
- A {{ model.shortTechName }} node will restart if its associated {{ model.shortTechName }} Agent process crashes.
- Point-in-time restore functionality through the {{ model.techOpsName }} UI is not supported.

## Failed node recovery

A manual `nodetool removenode` call is currently required when replacing nodes. 

Nodes are not automatically replaced by the service in the event a system goes down. You may either manually replace nodes or build your own ruleset and automation to perform this operation automatically.
