---
layout: layout.pug
navigationTitle:  Edge-LB Usage
title: Edge-LB Usage
menuWeight: 60
excerpt:

enterprise: true
---

This page covers common commands for Edge-LB usage. For a more detailed list of CLI commands, consult the [dcos edgelb cli reference](/services/edge-lb/0.1/cli-reference/).

**Prerequsites:**

- Edge-LB [installed and running](/services/edge-lb/0.1/installing/).

# Create Pools

After launching a service and creating a [pool configuration file](/services/edge-lb/0.1/pool-configuration/), you can use the CLI to deploy it:

```
dcos edgelb config <pool-configuration-file>
```

# Update Pools

Updating pool configurations is the same command as creating them:

```
dcos edgelb config <pool-configuration-file>
```

## Normal Reload Scenario

A change to a service (such as scaling up) that is load balanced by a pool will trigger a reload of its load balancers. This reload has the following properies:

* No traffic is dropped (unless the service instance that was serving the request was killed).

* The load balancer will wait until existing connections terminate, so a long-running connection will prevent the reload from completing.

* A reload will occur at most once every 10 seconds.

The properties of this reload enable strategies like
[Blue/Green Deployment](/services/edge-lb/0.1/tutorials/blue-green-deploy/).

## Load Balancer Relaunch Scenario

A change to the load balancer pool (such as adding a secret) will trigger a relaunch of all load balancers in the pool. This relaunch has the following properies:

* Traffic is dropped
    * To minimize the impact, we suggest running more than one load balancer within the pool.
* The load balancer will be relaunched on the same node (unless the node itself has failed).

**Note:** The number of instances of load balancers *cannot be scaled down*. This limitation will be addressed in a future Edge-LB release.

# List Pools

List all names of currently configured pools.

```
dcos edgelb pool
```

# Delete Pools

Delete a pool and uninstall the deployed load balancers.

```
dcos edgelb pool delete <pool-name>
```

# View Pool Configuration

View the current configuration for all pools.

```
dcos edgelb config
```

You can also view the configuration for a single pool.

```
dcos edgelb pool config <pool-name>
```

# View Pool Status

List the names of each running load balancer instance in a pool.

```
dcos edgelb pool lb <pool-name>
```

You can then use those names to get more information about the load balancers.

```
dcos edgelb pool lb <pool-name> <lb-name>
```

The output should resemble the following.

```bash
...
{
  "containerStatus": {
    ...
    "networkInfos": [
      {
        ...
        "ipAddresses": [
          {
            ...
            "ipAddress": "10.0.6.138"
          }
        ]
      }
    ]
  },
  "executorId": {
    "value": "edgelb-pool__fe58bc1d-ea3b-4d80-b703-828144d02374"
  },
  "slaveId": {
    "value": "a4b62ed1-88cf-4e3d-bd8a-19cc8fc10ac0-S2"
  },
  "state": "TASK_RUNNING",
  "taskId": {
    "value": "edgelb-pool-0-server__fbae1265-f51e-48c9-8162-c09fe19b657d"
  },
  "taskName": "edgelb-pool-0-server"
}
```

# View Load Balancer Configuration

View the active load balancer configuration for all load balancers in a pool.

```
dcos edgelb pool artifact <pool-name> haproxy.cfg
```
