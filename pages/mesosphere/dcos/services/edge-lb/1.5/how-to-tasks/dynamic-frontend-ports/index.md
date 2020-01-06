---
layout: layout.pug
navigationTitle: Configuring a frontend port dynamically
title: Configuring a frontend port dynamically
menuWeight: 31
excerpt: How to configure a frontend port dynamically for Edge-LB load balancing
enterprise: true
---
You can configure the frontend ports used to expose and access the service for Edge-LB load balancing.  You can choose to manually specify the frontend port for each service or have Edge-LB automatically assign a port by setting a configuration option. 

# Before you begin
* You must have Edge-LB installed as described in the Edge-LB [installation instructions](/services/edge-lb/getting-started/installing).
* You must have the core DC/OS command-line interface (CLI) installed and configured to communicate with the DC/OS cluster.
* You must have the `edgelb` command-line interface (CLI) installed.
* You must have an active and properly-configured DC/OS Enterprise cluster.
* The DC/OS Enterprise cluster must have at least one DC/OS **private agent** node to run the load-balanced service and at least one DC/OS **public agent** node for exposing the load-balanced service.

# Configuring dynamic selection of frontend ports
With Edge-LB, you can dynamically assign the port used to access load balancing statistics by modifying the Edge-LB pool configuration file. Through the settings in the pool configuration file, you can control whether Edge-LB should use a predefined port or automatically assign a port for accessing load balancing statistics. 

# Create the sample pool configuration file
1. Open a text editor, then copy and paste the following sample `nginx-lb.json` pool configuration file that automatically sets the frontend port assignment:

    ```json
    {
    "apiVersion": "V2",
    "name": "nginx-lb",
    "count": 1,
    "haproxy": {
        "stats": {
        "bindPort": 15001
        },
        "frontends": [{
        "bindPort": 0,
        "protocol": "HTTP",
        "linkBackend": {
            "defaultBackend": "nginx-backend"
        }
        }],
        "backends": [{
        "name": "nginx-backend",
        "protocol": "HTTP",
        "services": [{
            "marathon": {
            "serviceID": "/nginx"
            },
            "endpoint": {
            "portName": "nginx-80"
            }
        }]
        }]
    }
    }
    ```
    In this sample configuration file, the `haproxy.frontends.bindPort` setting is `0`. This setting indicates that you want Edge-LB to automatically select the port to use for the `frontend` endpoint.

1. Deploy the Edge-LB pool by running the following command:

    ```bash
    dcos edgelb create nginx-lb.json
    ```

1. Verify that Edge-LB frontend port is chosen dynamically for the pool by running the following command:

    ```
    dcos edgelb endpoints nginx-lb
    ```

    This command displays endpoint information including the frontend port that was dynamically selected:

    ```
    NAME            PORT   INTERNAL IP           
    frontend_port0  1025  10.0.5.119, 10.0.6.5  
    stats_port      9090   10.0.5.119, 10.0.6.5
    ```

    In this example, the `nginx-lb` is pool automatically assigned the frontend port 1025.

1. Navigate to the URL to see the frontend for the nginx service routed through the Edge-LB `nginx-lb` pool configuration using the public IP address of the public agent.

    For example:

    ```
    http://<public_agent_public_IP>:1025
    ```
# Changing a previously-configured port
If you have manually configured an Edge-LB pool to use a specific frontend port for a service, updating the pool configuration file to use auto-assignment for the frontend port does not update the port used. For example, if you previously configured port 15000 as the frontend port and update the Edge-LB pool configuration `haproxy.frontends.bindPort` setting to `0` for dynamic allocation, Edge-LB will continue to use port 15000 as the frontend port.

To use dynamic port selection, delete the previous pool configuration and create and deploy a new pool configuration file with the `haproxy.frontends.bindPort: 0` setting.

# Enabling dynamic port allocation for multiple pools
Assigning a frontend port dynamically enables you to deploy more than one pool on an agent node without manually setting different values for each pool.  

By leveraging dynamic port allocation:
- You can deploy multiple pools on the same agent without worrying about port conflicts.
- You can avoid the limitations imposed by using the default stats port 9090 which restricted you to deploying only one Edge-LB pool per agent. 
- You can eliminate the need to identify and specify manual port assignments for Edge-LB pools running on the same agent.

When a public cloud load balancer like Amazon Web Services (AWS) Elastic load balancer (ELB) is positioned as an access point in front of an Edge-LB pool, the Elastic load balancer managed the proxy and load-balancing responsibilities between the client and the Edge-LB pool. In this type of scenario, assigning the frontend port dynamically enables you to use multiple frontend ports for multiple Edge-LB pools on the same agent, which results in more efficient resource consumption and utilization.
