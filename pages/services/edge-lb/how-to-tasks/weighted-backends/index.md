---
layout: layout.pug
navigationTitle: Weighted backends
title: Weighted backends
menuWeight: 35
excerpt: How to configure weighted backends Edge-LB load balancing
enterprise: true
---
By default, Edge-LB use a round-robin algorithm to distribute network traffic evenly to the appropriate backends. You can modify how workload is distributed, however, by modifying Edge-LB pool configuration settings.

# Before you begin
Before you create Edge-LB pools and pool configuration files, you should have DC/OS Enterprise cluster nodes installed and ready to use and have previously downloaded and installed the latest Edge-LB packages. 

For information about installing Edge-LB packages, see the [installation](/services/edge-lb/getting-started/installing/) instructions.

# Setting weighted values for backend servers

To add relative weights to backend servers, use the `pool.haproxy.backend.service.endpoint.miscStr` field. In the example below, the `/app-v1` service will receive 20 out of every 30 requests, and `/app-v2` will receive the remaining 10 out of every 30 requests. The default weight is 1, and the max weight is 256.

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
