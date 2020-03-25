---
layout: layout.pug
navigationTitle: Scaling load-balancer instances
title: Scaling load-balancer instances
menuWeight: 33
excerpt: How to scale up and scale down load balancer instances
enterprise: true
---

As you refine the deployment of agent nodes and services for your DC/OS&trade; Enterprise cluster, you might find that you need to add or reduce the number of load balancing pool instances that are distributing workload to your backend servers.

# Before you begin
Before you create Edge-LB pools and pool configuration files, you should have DC/OS Enterprise cluster nodes installed and ready to use, and have previously downloaded and installed the latest Edge-LB packages.

You must have:
* Edge-LB installed as described in the Edge-LB [installation instructions](/mesosphere/dcos/services/edge-lb/1.5/getting-started/installing).
* The core DC/OS command-line interface (CLI) installed and configured to communicate with the DC/OS cluster.
* The `edgelb` command-line interface (CLI) installed.
* An active and properly-configured DC/OS Enterprise cluster, with at least one DC/OS **private agent** node to run the load-balanced service and at least one DC/OS **public agent** node for exposing the load-balanced service.

For information about installing Edge-LB packages, see the [installation](/mesosphere/dcos/services/edge-lb/1.5/getting-started/installing/) instructions.

# Scaling Edge-LB pool instances up or down
You can achieve high availability for load-balancing application traffic by increasing, or decreasing, an Edge-LB pool’s HAProxy instances as needed. To do this, update the existing Edge-LB pool configuration ```count``` variable to change the number of HAProxy instances.

The following steps show how to create an Edge-LB pool configuration file to scale up the number of instances for a deployed NGINX&trade; service. You can use these same steps to "scale-down" the number of instances, as well.

# To add (or remove) Edge-LB load balancer instances
1. Create a baseline pool configuration file, `scaleup-nginx-lb.json`:

    ```
    dcos edgelb create scaleup-nginx-lb.json
    ```

1. Open the pool configuration file, and copy and paste the following sample JSON settings to populate it:

    ```json
    {
      "apiVersion": "V2",
      "name": "scaleup-nginx-lb",
      "count": 1,
      "haproxy": {
        "frontends": [
        {
          "bindPort": 15002,
          "protocol": "HTTP",
          "linkBackend": {
            "defaultBackend": "nginx-backend"
          }
        }
      ],
        "backends": [
        {
          "name": "nginx-backend",
          "protocol": "HTTP",
          "services": [
            {
            "marathon": {
              "serviceID": "/nginx"
            },
            "endpoint": {
              "portName": "nginx-port"
            }
          }
        ]
        }
      ],
        "stats": {
          "bindPort": 0
        }
      }
    }
    ```

    In this sample baseline configuration, the `count` variable is set to 1. With this setting, the Edge-LB pool uses one load balancer instance from one of the public agents to distribute incoming traffic from all available public agent nodes. We can increase the count for now, and then use these same procedures to decrease the count later, if needed.

1. Modify ```scaleup-nginx-lb.json``` to scale up the number of Edge-LB pool instances, by changing the `count` setting from 1 to 3.

    ```json
    {
      "apiVersion": "V2",
      "name": "scaleup-nginx-lb",
      "count": 3,
      "haproxy": {
        "frontends": [
        {
          "bindPort": 15002,
          "protocol": "HTTP",
          "linkBackend": {
            "defaultBackend": "nginx-backend"
          }
        }
      ],
        "backends": [
        {
          "name": "nginx-backend",
          "protocol": "HTTP",
          "services": [
            {
            "marathon": {
              "serviceID": "/nginx"
            },
            "endpoint": {
              "portName": "nginx-port"
            }
          }
        ]
        }
      ],
        "stats": {
          "bindPort": 0
        }
      }
    }
    ```

1. Update the Edge-LB pool to use the new configuration settings:

    ```bash
    dcos edgelb update scaleup-nginx-lb.json
    ```

1. Verify that the change to the number of load balancer instances was deployed successfully:

    ```
    dcos edgelb status scaleup-nginx-lb
    ```

    You should now see three pools listed in the output. You can also see the Edge-LB endpoints with the `dcos edgelb endpoint` command.

    ```
    > dcos edgelb status scaleup-nginx-lb
      NAME                  TASK ID                                                                                         STATE
      edgelb-pool-0-server  dcos-edgelb.pools.scaleup-nginx-lb__edgelb-pool-0-server__a65c5779-dad2-4727-8f2f-84f4be060835  TASK_RUNNING
      edgelb-pool-1-server  dcos-edgelb.pools.scaleup-nginx-lb__edgelb-pool-1-server__5112fb7c-1759-472a-97d3-d637b7b8eec8  TASK_RUNNING
      edgelb-pool-2-server  dcos-edgelb.pools.scaleup-nginx-lb__edgelb-pool-2-server__acea4d0b-09ba-4eeb-a6ea-84b82217bb8e  TASK_RUNNING
    ```

    To view the output from the `endpoints` subcommand:

    ```
    dcos edgelb endpoints scaleup-nginx-lb
    ```

    If it appears in the command output, the `count` column displays the number of load balancer instances you have specified in the Edge-LB pool configuration file.

    ```
    NAME                    PORT   INTERNAL IPS   EXTERNAL IPS
    frontend_0.0.0.0_15002  15002  172.12.12.167  54.173.77.146
                                   172.12.23.239  100.24.113.243  
                                   172.12.42.163  18.212.166.130  
    stats                   1027   172.12.12.167  54.173.77.146
                            1029   172.12.23.239  100.24.113.243  
                                   172.12.42.163  18.212.166.130  
    Public/private IPs metadata is inaccurate in case of pools that use virtual networks.
    ```

<p class="message--important"><strong>IMPORTANT: </strong>You can only scale up to the total number of public agents you have available in the DC/OS cluster. For example, if you have deployed five public agent nodes in your DC/OS cluster, you can scale up to a maximum of five Edge-LB load balancer instances. If you change the <code>count</code> setting to a number greater than the number of public agents you have deployed - for example, by setting the `count` to 6 - only the maximum of five Edge-LB load balancer instances will be available to handle the traffic from the five available public agents.</p>

To scale down Edge-LB pool instances, you can change the `count` setting to a lower number. For example, if the previous count in the Edge-LB pool configuration file was 5, you could scale down the number of instances available by changing the `count` setting to 2.
