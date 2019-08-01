---
layout: layout.pug
navigationTitle: Usage
title: Usage
menuWeight: 60
excerpt: Common commands for Edge-LB usage

enterprise: true
---

This page covers common commands for Edge-LB usage. For a more detailed list of CLI commands, consult the [dcos edgelb cli reference](/mesosphere/dcos/services/edge-lb/1.3/cli-reference/).

# Prerequisites

- Edge-LB [installed and running](/mesosphere/dcos/services/edge-lb/1.3/installing/).

# Create pools

After launching a service and creating a [pool configuration file](/mesosphere/dcos/services/edge-lb/1.3/pool-configuration/), you can use the CLI to deploy it:

```bash
dcos edgelb create <pool-configuration-file>
```

Please refer to the [tutorials sections](/mesosphere/dcos/services/edge-lb/1.3/tutorials/) for examples of pool configs.

# Update pools

Update a pool's configuration with the following command:

```bash
dcos edgelb update <pool-configuration-file>
```

# Scale down Edge-LB pool instances

To scale down Edge-LB pool instances change the count to a lower number. E.g. if the previous count in the Edge-LB pool config was 5, change it to 2.

An Example config file for Edge-LB pool config:

```json
{
  "id": "/my-app",
  ...
  "name": "sample-minimal",
  "count": 2,
  ...
}
```

# Exposing tasks without predefined Mesos-assigned ports

This feature allows you to expose a task without a Mesos-assigned port. 

Prior to this feature, Edge-LB only exposed tasks that have ports assigned by Mesos. It is not a requirement for Mesos tasks to always have ports assigned. When there is no port assigned for task, this feature allows you to specify a port in the pool configuration to expose that task.

# Allow dynamic allocation of the HAProxy Stats port

This feature allows you to allocate Stats port dynamically if there is more than one pool on an agent node. 

Prior to this feature, it was not possible to disable Stats port 9090 for a pool. This results in having only one Edge-LB pool per agent. Thus, it was not possible to deploy two Edge-LB pools on the same agent without manually setting different values for the Stats port. This feature allows multiple pools on the same agent to have a Stats port without port conflicts.

An example config for Edge-LB pool where `stats` port (haproxy.stats.bindPort) is `0` instead of typical `9090`:

```json
{
  "apiVersion": "V2",
  "name": "test-https-pool",
  "count": 1,
  "haproxy": {
    "stats": {
      "bindPort": 0
    },
    "frontends": [
      {
        "bindPort": 443,
        "linkBackend": {
          "defaultBackend": "host-httpd"
        }
      }
    ],
    "backends": [
      {
        "name": "host-httpd",
        "protocol": "HTTP",
        "services": [
          {
            "framework": {
              "value": "marathon"
            },
            "marathon": {
              "serviceID": "/host-httpd"
            },
            "endpoint": {
              "portName": "web"
            }
          }
        ]
      }
    ]
  }
}
```

# Allow dynamic allocation of the HAProxy frontend port

This feature allows you to allocate a Frontend port dynamically if there is more than one pool on an agent node. 

When a public cloud LB like AWS ELB is sitting in front of Edge-LB, the ELB will handle the proxy/load-balancing between the Client and the Edge-LB pool. In such scenarios, having frontend ports does not provide much value. This feature allows you to have multiple Frontend ports allocated dynamically for multiple Edge-LB pools on the same agent for better resource utilization.

An example config for Edge-LB pool where `frontend` port (i.e. haproxy.frontend.bindPort) is `443` instead of typical `0`: 

```json
{
  "apiVersion": "V2",
  "name": "test-https-pool",
  "count": 1,
  "autoCertificate": true,
  "haproxy": {
    "stats": {
      "bindPort": 9091
    },
    "frontends": [
      {
        "bindPort": 0,
        "protocol": "HTTPS",
        "certificates": [
          "$AUTOCERT"
        ],
        "linkBackend": {
          "defaultBackend": "host-httpd"
        }
      }
    ],
    "backends": [
      {
        "name": "host-httpd",
        "protocol": "HTTP",
        "services": [
          {
            "framework": {
              "value": "marathon"
            },
            "marathon": {
              "serviceID": "/host-httpd"
            },
            "endpoint": {
              "portName": "web"
            }
          }
        ]
      }
    ]
  }
}
```

## Normal reload scenario

A change (such as scaling up) to a service that is load balanced by a pool will trigger a reload of its load balancers. This reload has the following properties:

* No traffic is dropped (unless the service instance that was serving the request was killed).

* The load balancer will keep the long-running connections intact, while all the new connections will be proxied using the new configuration.

* A reload will occur at most once every three seconds.

The properties of this reload enables strategies like [Blue/Green Deployment](/mesosphere/dcos/services/edge-lb/1.3/tutorials/blue-green-deploy/).

## Load balancer relaunch scenario

A change (such as adding a secret) to the load balancer pool will trigger a relaunch of all load balancers in the pool. This relaunch has the following properties:

- Traffic currently flowing through the given load balancer is dropped when it is stopped. To minimize the impact, we suggest running more than one load balancer within the pool.
- Only one load balancer is stopped in the pool during the update at a time.
- The load balancer will be relaunched on the same node (unless the node itself has failed).

<p class="message--warning"><strong> WARNING: </strong>The number of instances of load balancers cannot be scaled down. This limitation will be addressed in a future Edge-LB release.</p>

## Replacing a failed pod

By default, Edge-LB load balancer instances are tied to a given node; when the node goes down, Edge-LB does not automatically relocate the pod containing the Edge-LB load balancer instance to a new node. You must issue a `pod replace` command to the pool scheduler to tell it to start the load balancer instance on a new node. If a machine hosting a pod is permanently lost, manual intervention is required to discard the missing pod and start it on a new node.

This can all be done using the dcos CLI `edgelb-pool` subcommand (note that this is distinct from the `edgelb` subcommand, and must be installed separately if it has not yet been installed).

1. Install the `edgelb-pool` CLI subcommand:

```bash
$ dcos package install edgelb-pool --cli --yes
```

2. Get the name of the pool that owns the pod you need to relocate:

```bash
$ dcos edgelb list
```

This should show all pool configurations. The pool that has a missing pod will be your value for `<pool-name>` below.

3. Get the name of the pod you need to replace (the one that was running on the removed public agent). This will be your value for `<pod-id>`.

```bash
$ dcos edgelb-pool --name=/dcos-edgelb/pools/<pool-name> pod list
```

4. Use `<pod-id>` with the `pod replace` command:

```bash
$ dcos edgelb-pool --name=/dcos-edgelb/pools/<pool-name> pod replace <pod-id>
```

This will destroy the pool server and re-launch a new one on the new public agent.

For a list of Edge-LB commands, see the [CLI Reference](/mesosphere/dcos/services/edge-lb/1.3/cli-reference/) page.
