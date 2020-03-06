---
layout: layout.pug
navigationTitle: Weighted backends
title: Weighted backends
menuWeight: 35
excerpt: How to configure weighted backends Edge-LB load balancing
enterprise: true
---

By default, Edge-LB uses a round-robin algorithm to distribute network traffic evenly to the appropriate backends. You can change how the workload is distributed by modifying Edge-LB pool configuration settings.

# Before you begin
Before you create Edge-LB pools and pool configuration files, you should have DC/OS&trade; Enterprise cluster nodes installed and ready to use, and have previously downloaded and installed the latest Edge-LB packages.

You must have;
* Edge-LB installed as described in the Edge-LB [installation instructions](/mesosphere/dcos/services/edge-lb/1.5/getting-started/installing).
* The core DC/OS command-line interface (CLI) installed and configured to communicate with the DC/OS cluster.
* The `edgelb` command-line interface (CLI) installed.
* An active and properly-configured DC/OS Enterprise cluster, with at least one DC/OS **private agent** node to run the load-balanced service and at least one DC/OS **public agent** node for exposing the load-balanced service.

For information about installing Edge-LB packages, see the [installation](/mesosphere/dcos/services/edge-lb/1.5/getting-started/installing/) instructions.

# Setting weighted values for backend servers

To add relative weights to backend servers, use the `pool.haproxy.backend.service.endpoint.miscStr` field. The default weight is 1, and the max weight is 256.

In the example below, the `/app-v1` service will receive 20 out of every 30 requests, and `/app-v2` will receive the remaining 10 out of every 30 requests.

This approach can be used to implement some canary or A/B testing use cases.

```json
{
  "apiVersion": "V2",
  "name": "app-lb",
  "count": 1,
  "haproxy": {
    "frontends": [{
      "bindPort": 80,
      "protocol": "HTTP",
      "linkBackend": {
        "defaultBackend": "default"
      }
    }],
    "backends": [{
      "name": "default",
      "protocol": "HTTP",
      "services": [{
        "marathon": {
          "serviceID": "/app-v1"
        },
        "endpoint": {
          "portName": "web",
          "miscStr": "weight 20"
        }
      },{
        "marathon": {
          "serviceID": "/app-v2"
        },
        "endpoint": {
          "portName": "web",
          "miscStr": "weight 10"
        }
      }]
    }]
  }
}
```
