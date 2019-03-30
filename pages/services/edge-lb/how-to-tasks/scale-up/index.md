---
layout: layout.pug
navigationTitle: Scaling load-balancer instances
title: Scaling load-balancer instances
menuWeight: 33
excerpt: How to scale up and scale down load balancer instances
enterprise: true
---
As you refine the deployment of agent nodes and services for your DC/OS Enterprise cluster, you might find that you need to add or reduce the number of load balancing pool instances that are distributing workload to your backend servers. 

# Before you begin
Before you create Edge-LB pools and pool configuration files, you should have DC/OS Enterprise cluster nodes installed and ready to use and have previously downloaded and installed the latest Edge-LB packages. 

For information about installing Edge-LB packages, see the [installation](/services/edge-lb/getting-started/installing/) instructions.

# Scaling up Edge-LB pool instances
You can achieve high availability for load-balancing application traffic by increasing Edge-LB pool’s HAProxy instances. You can simply update the existing Edge-LB pool configuration by modifying the ‘count’ variable to increase the number of HAProxy instances.

The following steps illustrate how to create an Edge-LB pool configuration file to scale up the number of instances for a deployed `nginx` service.

# To add Edge-LB load balancer instances
1. Open a text editor to create the `scaleup-nginx-lb.json` pool configuration file:

    ```bash
    vi scaleup-nginx-lb.json
    ```

1. Copy and paste the following sample JSON settings to create a baseline `scaleup-nginx-lb.json` pool configuration file:

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

    In this sample baseline configuration, the `count` variable is set to 1. With this setting, the Edge-LB pool uses one load balancer instance from one of the public agents to distribute incoming traffic from all available public agent nodes.

1. Modify the sample Edge-LB pool configuration file to scale up the number of Edge-LB pool instances from 1 to 3.

    ```bash
    vi scaleup-nginx-lb.json
    ```
    For example:
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

1. Verify the change to the number of load balancer instances has been deployed successfully by running the following command:

    ```
    dcos edgelb status scaleup-nginx-lb
    ```

    You should see two pools listed in the output for this command. You can also see the Edge-LB endpoints with the `dcos edgelb endpoint` command. In the command output, the `count` column displays the number of load balancer instances you have specified in the Edge-LB pool configuration file. 
    
    To view the output from the endpoints subcommand, run the following command:

    ```
    dcos edgelb endpoints scaleup-nginx-lb
    ```

    You can only scale up to the total number of public agents you have available in the DC/OS cluster. For example, if you have deployed five public agent nodess in your DC/OS cluster, you can scale up to a maximum of five Edge-LB load balancer instances. If you change the `count` setting to a number greater than the number of public agents you have deployed--for example, by setting the `count` to 6--only the maximum of five Edge-LB load balancer instances are available to handle the traffic from the five available public agents.

# Scale down Edge-LB pool instances
To scale down Edge-LB pool instances, you can change the `count` setting to a lower number. For example, if the previous count in the Edge-LB pool configuration file was 5, you can scale down the number of instances available by changing the `count` setting to 2.

To scale down the number of Edge-LB load balancer instances:
1. Open and modify the Edge-LB configuration file:

    ```json
    {
      "apiVersion": "V2",
      "name": "scaledown-nginx-lb",
      "count": 2,
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
    dcos edgelb update scaledown-nginx-lb.json
    ```

1. Verify the change to the number of load balancer instances has been deployed successfully by running the following command:

    ```
    dcos edgelb status scaledown-nginx-lb
    ```