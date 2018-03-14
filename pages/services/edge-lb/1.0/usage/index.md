---
layout: layout.pug
navigationTitle:  Edge-LB Usage
title: Edge-LB Usage
menuWeight: 60
excerpt:

enterprise: true
---

This page covers common commands for Edge-LB usage. For a more detailed list of CLI commands, consult the [dcos edgelb cli reference](/services/edge-lb/1.0/cli-reference/).

**Prerequsites:**

- Edge-LB [installed and running](/services/edge-lb/1.0/installing/).

# Create Pools

After launching a service and creating a [pool configuration file](/services/edge-lb/1.0/pool-configuration), you can use the CLI to deploy it:

```
dcos edgelb create <pool-configuration-file>
```

# Update Pools

Update a pool's configuration with the following command:

```
dcos edgelb update <pool-configuration-file>
```

## Normal Reload Scenario

A change to a service (such as scaling up) that is load balanced by a pool will trigger a reload of its load balancers. This reload has the following properies:

* No traffic is dropped (unless the service instance that was serving the request was killed).

* The load balancer will wait until existing connections terminate, so a long-running connection will prevent the reload from completing.

* A reload will occur at most once every 10 seconds.

The properties of this reload enable strategies like
[Blue/Green Deployment](/services/edge-lb/1.0/tutorials/blue-green-deploy).

## Load Balancer Relaunch Scenario

A change to the load balancer pool (such as adding a secret) will trigger a relaunch of all load balancers in the pool. This relaunch has the following properies:

* Traffic is dropped
    * To minimize the impact, we suggest running more than one load balancer within the pool.
* The load balancer will be relaunched on the same node (unless the node itself has failed).

**Note:** The number of instances of load balancers *cannot be scaled down*. This limitation will be addressed in a future Edge-LB release.

# List Pools

List all names of currently configured pools.

```
dcos edgelb list
```

# Delete Pools

Delete a pool and uninstall the deployed load balancers.

```
dcos edgelb delete <pool-name>
```

# View Pool Configuration

View the current configuration for a pool.

```
dcos edgelb show <pool-name>
```

# View Pool Status

List the names of each running load balancer instance in a pool.

```
dcos edgelb status <pool-name>
```

# View Pool Endpoints

The internal ip address and ports for a pool can be found with this command:

```
dcos edgelb endpoints <pool-name>
```

# View Load Balancer Configuration

View the active load balancer configuration for all load balancers in a pool.

```
dcos edgelb lb-config <pool-name>
```

# Managing Templates

The rendered `haproxy.cfg` for a pool is generated using a template named `haproxy.cfg.ctmpl`. It is possible for advanced users to modify and upload a custom version of this template.

## Show Default Template

```
dcos edgelb template show
```

## Show Pool Template

```
dcos edgelb template show <pool-name>
```

## Create Pool Template

```
dcos edgelb template create <pool-name> <template-file>
```

## Update Pool Template

```
dcos edgelb template update <pool-name> <template-file>
```

## Delete / Revert Pool Template

```
dcos edgelb template delete <pool-name>
```
