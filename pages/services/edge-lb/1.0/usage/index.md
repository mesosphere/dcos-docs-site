---
layout: layout.pug
navigationTitle:  Edge-LB Usage
title: Edge-LB Usage
menuWeight: 60
excerpt: Common commands for Edge-LB usage

enterprise: true
---

This page covers common commands for Edge-LB usage. For a more detailed list of CLI commands, consult the [dcos edgelb cli reference](/services/edge-lb/1.0/cli-reference/).

# Prerequsites

- Edge-LB [installed and running](/services/edge-lb/1.0/installing/).

# Create pools

After launching a service and creating a [pool configuration file](/services/edge-lb/1.0/pool-configuration), you can use the CLI to deploy it:

```
dcos edgelb create <pool-configuration-file>
```

# Update pools

Update a pool's configuration with the following command:

```
dcos edgelb update <pool-configuration-file>
```

## Normal reload scenario

A change to a service (such as scaling up) that is load balanced by a pool will trigger a reload of its load balancers. This reload has the following properties:

* No traffic is dropped (unless the service instance that was serving the request was killed).

* The load balancer will wait until existing connections terminate, so a long-running connection will prevent the reload from completing.

* A reload will occur at most once every 10 seconds.

The properties of this reload enable strategies like
[Blue/Green Deployment](/services/edge-lb/1.0/tutorials/blue-green-deploy).

## Load balancer relaunch scenario

A change to the load balancer pool (such as adding a secret) will trigger a relaunch of all load balancers in the pool. This relaunch has the following properties:

- Traffic is dropped. To minimize the impact, we suggest running more than one load balancer within the pool.
- The load balancer will be relaunched on the same node (unless the node itself has failed).

**Note:** The number of instances of load balancers cannot be scaled down. This limitation will be addressed in a future Edge-LB release.

## Replacing a failed pod

When a node goes down, Edge-LB does not automatically relocate the pools to a new node. You must issue a `pod replace` command to move pools. If a machine hosting a pod is permanently lost, manual intervention is required to discard the downed pod and reconstruct it on a new machine.

1. Install the `edgelb pool cli`:

```
$ dcos package install edgelb-pool --cli --yes
```
2. Get the name of the pool you need to relocate:

```
dcos edgelb show
```
This should show all pool configurations. The pool you are relocating will be your value for `<pool-name>` below.

3. Get the name of the pod you need to replace (the one that was running on the removed public agent). This will be your value for `<pod-id>`.

```
$ dcos edgelb-pool --name=/dcos-edgelb/pools/<pool-name> pod list
```
4. Use `<pod-id>` with the `pod replace` command:

```
$ dcos edgelb-pool --name=/dcos-edgelb/pools/<pool-name> pod replace <pod-id>
```

This will destroy the pool server and re-launch a new one on the new public agent.

For a list of Edge-LB commands, see the [CLI Reference](/services/edge-lb/1.0/cli-reference/) page.
