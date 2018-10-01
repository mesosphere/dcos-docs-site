---
layout: layout.pug
navigationTitle:
excerpt: Known limitations for the DC/OS DataStax Enterprise service
title: Limitations
menuWeight: 100
model: /services/dse/data.yml
render: mustache
---

#include /services/include/limitations.tmpl
#include /services/include/limitations-zones.tmpl

## Service Limits
- Multiple {{ model.techShortName }} instances on a host is not supported in production.
- A single {{ model.techOpsName }} cannot manage multiple {{ model.techShortName }} clusters, but can manage multiple DCs in the same cluster.

## Automatic failed node recovery

A manual `nodetool removenode` call is currently required when replacing nodes. This is planned to be automated in a future release.

Nodes are not automatically replaced by the service in the event a system goes down. You may either manually replace nodes or build your own ruleset and automation to perform this operation automatically.

## Rack-aware replication

Rack awareness within the DC/OS {{ model.techShortName }} Service is not currently supported, but is planned to be supported with a future release of DC/OS.
