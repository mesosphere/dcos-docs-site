---
layout: layout.pug
navigationTitle: Configuring the statistics port
title: Configuring the statistics port
menuWeight: 32
excerpt: How to configure the statistics port dynamically for Edge-LB load balancing
enterprise: true
---
You can configure the port used as the endpoint for viewing Edge-LB load balancing statistics. By default, you view load balancing statistics by connecting to the public agent IP address using the `haproxy?stats` endpoint and port 9090. However, you can choose to manually specify the statistics port you want to use or have Edge-LB automatically assign a port by setting a configuration option. 

# Before you begin
* You must have Edge-LB installed as described in the Edge-LB [installation instructions](/services/edge-lb/getting-started/installing).
* You must have the core DC/OS command-line interface (CLI) installed and configured to communicate with the DC/OS cluster.
* You must have the `edgelb` command-line interface (CLI) installed.
* You must have an active and properly-configured DC/OS Enterprise cluster.
* The DC/OS Enterprise cluster must have at least one DC/OS **private agent** node to run the load-balanced service and at least one DC/OS **public agent** node for exposing the load-balanced service.

# Configuring dynamic selection of the stats port
With Edge-LB, you can dynamically assign the port used to access load balancing statistics by modifying the Edge-LB pool configuration file. Through the settings in the pool configuration file, you can control whether Edge-LB should use a predefined port or automatically assign a port for accessing load balancing statistics. 

Because you control this setting in the pool configuration file, and therefore, for a given set of Edge-LB pool instances, you can choose to deploy separate pool configuration files for services that should use the default port, a predefined port, or a dynamically-assigned port.

# Create the sample pool configuration file

1. Open a text editor, then copy and paste the following sample `nginx-lb.json` pool configuration file that automatically sets the statistics (`stats`) port assignment:

    ```json
    {
    "apiVersion": "V2",
    "name": "nginx-lb",
    "count": 1,
    "haproxy": {
        "stats": {
        "bindPort": 0
        },
        "frontends": [{
        "bindPort": 15000,
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

    In this sample configuration file, the `haproxy.stats.bindPort` setting is `0`. This setting indicates that you want Edge-LB to automatically select the port to use for the `stats` endpoint.

1. Deploy the Edge-LB pool configuration by running the following command:

    ```bash
    dcos edgelb create nginx-lb.json
    ```

1. Verify the stats port that has been dynamically assigned to the Edge-LB pool:

    ```bash
    dcos edgelb endpoints nginx-lb
    ```

    This command displays a confirmation message similar to the following if deployment is successful:

    ```
    NAME            PORT   INTERNAL IP           
    frontend_port0  15000  10.0.5.119, 10.0.6.5  
    stats_port      1026   10.0.5.119, 10.0.6.5
    ```

1. Navigate to the URL to see the statistics of the Edge-LB pools using the public IP address of the public agent.

    ```
    http://<public_agent_public_IP>:1026/haproxy?stats
    ```

# Changing a previously-configured port
If you have manually configured an Edge-LB pool to use a specific port for accessing HAProxy statistics, updating the pool configuration file to use auto-assignment for the stats port does not update the port used. For example, if you previously configured port 9090 as the statistics port and update the Edge-LB pool configuration `haproxy.stats.bindPort` setting to `0` for dynamic allocation, Edge-LB will continue to use port 9090 for HAProxy statistics.

To use dynamic port selection, delete the previous pool configuration and create and deploy a new pool configuration file with the `haproxy.stats.bindPort: 0` setting.

# Enabling dynamic port allocation for multiple pools
Assigning the port used for the stats endpoint dynamically enables you to deploy more than one pool on an agent node without manually setting different values for each pool.  

By leveraging dynamic port allocation:
- You can deploy multiple pools on the same agent without worrying about port conflicts.
- You can avoid the limitations imposed by using the default stats port 9090 which restricted you to deploying only one Edge-LB pool per agent. 
- You can eliminate the need to identify and specify manual port assignments for Edge-LB pools running on the same agent.
