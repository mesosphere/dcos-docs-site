---
layout: layout.pug
navigationTitle: Internal-only load balancing
title: Internal-only load balancing
menuWeight: 36
excerpt: How to configure East-West internal-only load balancing using Edge-LB
enterprise: true
---
In most cases, load balancing for traffic inside of a DC/OS cluster--referred to **internal** or **East-West** load balancing--is managed through the DC/OS layer-4 load-balancer (`dcos-l4lb`), which is part of the networking layer (`dcos-net`) of the DC/OS platform. With the DC/OS layer-4 load-balancer, you configure load balancing through [virtual IP addresses](/latest/networking/load-balancing-vips) in app definitions without creating a separate load balancing configuration file.

In some cases, however, you might find it desirable or necessary to use Edge-LB for load balancing the traffic inside of a DC/OS cluster. For example, if you need layer-7 load balancing capability at the application level for traffic within the cluster, you can configure an Edge-LB pool to handle load balancing for internal-only traffic.

This section illustrates how to set Edge-LB pool configuration options to enable internal load balancing for services running inside of a DC/OS cluster.

# Before you begin
Before you create Edge-LB pools and pool configuration files, you should have DC/OS Enterprise cluster nodes installed and ready to use and have previously downloaded and installed the latest Edge-LB packages. 

For information about installing Edge-LB packages, see the [installation](/services/edge-lb/getting-started/installing/) instructions.

# Configure internal (East / West) load balancing
If you have client requests originating inside of a cluster for access to applications running on private agent nodes, you might want to configure one or more Edge-LB pools to route those requests for internal load balancing.

## To configure Edge-LB for internal load balancing

1. Open a text editor, then copy and paste the following sample settings to create the `internal-lb.json` pool configuration file:
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

1. Review the sample settings to see how the following field values need to be modified to enable load balancing for internal service requests:
    * Set the `pool.haproxy.stats.bindPort` and `pool.haproxy.frontend.bindPort` fields to a port that is available on at least one private agent.

    * Set the `pool.role` to something other than the default `slave_public` value. In most cases, you can set this field using the `"*"` wildcard unless you have created a separate role for this purpose.

1. Deploy the modified Edge-LB pool configuration by running the following command:

    ```bash
    dcos edgelb create internal-lb.json
    ```

1. Verify access by navigating to the private agent IP address and port number.