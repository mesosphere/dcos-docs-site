---
layout: layout.pug
navigationTitle:  Limitations
title: Limitations
menuWeight: 110
excerpt:
featureMaturity:
enterprise: false
---

- Multiple DSE Instances on a host is not supported in production.
- Stopping or restarting a DSE node from OpsCenter is not supported. Use `dcos pods restart` to restart DSE nodes from the DC/OS CLI.
- Shrinking DSE cluster size (number of DSE nodes) is not supported.
- A single OpsCenter cannot manage multiple DSE clusters, but can manage multiple DCs in the same cluster.
- A DSE node will restart if its associated DSE Agent process crashes.

## Removing a Node
Removing a node is not supported at this time.

## Automatic Failed Node Recovery
A manual `nodetool removenode` call is currently required when replacing nodes. This is planned to be automated in a future release.

Nodes are not automatically replaced by the service in the event a system goes down. You may either manually replace nodes as described under [Managing](#managing), or build your own ruleset and automation to perform this operation automatically.

## Updating Storage Volumes
Neither volume type nor volume size requirements may be changed after initial deployment.

## Rack-aware Replication
Rack awareness within the DC/OS DSE Service is not currently supported, but is planned to be supported with a future release of DC/OS.
