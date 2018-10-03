---
layout: layout.pug
navigationTitle:  Limitations
title: Limitations
menuWeight: 100
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/dse-private -->


- Multiple DSE Instances on a host is not supported in production.
- Stopping or restarting a DSE node from OpsCenter is not supported. Use `dcos pod restart` to restart DSE nodes from the DC/OS CLI.
- A single OpsCenter cannot manage multiple DSE clusters, but can manage multiple DCs in the same cluster.
- A DSE node will restart if its associated DSE Agent process crashes.

## Automatic failed node recovery

A manual `nodetool removenode` call is currently required when replacing nodes. This is planned to be automated in a future release.

Nodes are not automatically replaced by the service in the event a system goes down. You may either manually replace nodes as described under [Managing](/services/dse/2.0.3-5.1.2/managing/), or build your own ruleset and automation to perform this operation automatically.

## Rack-aware replication

Rack awareness within the DC/OS DSE Service is not currently supported, but is planned to be supported with a future release of DC/OS.

## Out-of-band configuration

Out-of-band configuration modifications are not supported. The service's core responsibility is to deploy and maintain the service with a specified configuration. In order to do this, the service assumes that it has ownership of task configuration. If an end-user makes modifications to individual tasks through out-of-band configuration operations, the service will override those modifications at a later time. For example:
- If a task crashes, it will be restarted with the configuration known to the scheduler, not one modified out-of-band.
- If a configuration update is initiated, all out-of-band modifications will be overwritten during the rolling update.

## Scaling in

To prevent accidental data loss, the service does not support reducing the number of pods.

## Disk changes

To prevent accidental data loss from reallocation, the service does not support changing volume requirements after initial deployment.

## Best-effort installation

If your cluster doesn't have enough resources to deploy the service as requested, the initial deployment will not complete until either those resources are available or until you reinstall the service with corrected resource requirements. Similarly, scale-outs following initial deployment will not complete if the cluster doesn't have the needed available resources to complete the scale-out.

## Virtual networks

When the service is deployed on a virtual network, the service may not be switched to host networking without a full re-installation. The same is true for attempting to switch from host to virtual networking.
