---
layout: layout.pug
navigationTitle: Internal-only load balancing
title: Internal-only load balancing
menuWeight: 23
excerpt: How to configure East-West internal-only load balancing using Edge-LB
enterprise: true
---

This section provides code examples that illustrate how to set Edge-LB pool configuration options using the Edge-LB REST API with application definitions and sample pool configuration settings.

# Before you begin
Before you create Edge-LB pools and pool configuration files, you should have DC/OS Enterprise cluster nodes installed and ready to use and have previously downloaded and installed the latest Edge-LB packages. 

For information about installing Edge-LB packages, see the [installation](/services/edge-lb/getting-started/installing/) instructions.

# Internal (East / West) load balancing
In most cases, load balancing for traffic inside of a DC/OS cluster--referred to **internal** or **East-West** load balancing--is managed through the DC/OS layer-4 load-balancer (`dcos-l4lb`), which is part of the networking layer (`dcos-net`) of the DC/OS platform. With the DC/OS layer-4 load-balancer, you configure load balancing through [virtual IP addresses](/latest/networking/load-balancing-vips) in app definitions without creating a separate load balancing configuration file.

In some cases, however, you might find it desirable or necessary to use Edge-LB for load balancing the traffic inside of a DC/OS cluster. For example, if you need layer-7 load balancing capability at the application level for traffic within the cluster, you can configure an Edge-LB pool to handle load balancing for internal-only traffic.

The following changes necessary are:

* Change the `pool.haproxy.stats.bindPort`, `pool.haproxy.frontend.bindPort` to some port that is available on at least one private agent.
* Change the `pool.role` to something other than `slave_public` (the default). Usually `"*"` works unless you have created a separate role for this purpose.

```json
{
  "apiVersion": "V2",
  "name": "internal-lb",
  "role": "*",
  "count": 1,
  "haproxy": {
    "stats": {
      "bindPort": 15001
    },
    "frontends": [{
      "bindPort": 15000,
      "protocol": "HTTP",
      "linkBackend": {
        "defaultBackend": "app-backend"
      }
    }],
    "backends": [{
      "name": "app-backend",
      "protocol": "HTTP",
      "services": [{
        "marathon": {
          "serviceID": "/my-app"
        },
        "endpoint": {
          "portName": "web"
        }
      }]
    }]
  }
}
```
