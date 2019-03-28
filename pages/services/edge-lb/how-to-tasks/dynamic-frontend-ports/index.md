---
layout: layout.pug
navigationTitle: Configuring a frontend port dynamically
title: Configuring a frontend port dynamically
menuWeight: 22
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

NOTE the haproxy.frontends.bindPort is 0. This will allow Edge-LB to pick auto generated frontend port.

1. Deploy the Edge-LB pool by running the following command:

    ```bash
    dcos edgelb create nginx-lb.json
    ```

1. Verify that Edge-LB frontend port is chosen dynamically by the pool:

    ```
    dcos edgelb endpoints nginx-lb
    ```

Example output of the frontend port that was picked dynamically. In the example below, the nginx-lb pool automatically assigned stats port 1025.
Mesospheres-MacBook-Pro-22268: dan$ 
Mesospheres-MacBook-Pro-22268: dan$ dcos edgelb endpoints sample-minimal
  NAME            PORT   INTERNAL IP           
  frontend_port0  1025  10.0.5.119, 10.0.6.5  
  stats_port      9090   10.0.5.119, 10.0.6.5  
Mesospheres-MacBook-Pro-22268: dan$
Mesospheres-MacBook-Pro-22268: dan$

1. Go to the below URL to see the statistics of the Edge-LB pools. Please don't forget to replace the public IP of the public agents:

    ```
    http://<public_agent_public_IP>:1025
    ```

NOTE: If you have already configured the frontend port manually with specific port, then if you update the pool config with auto-assigned frontend port, the frontend port will stay the same. For example, If you previously configured 15000 as the frontend port and update the Edge-LB pool config with frontend port '0', then the Edge-LB will still have 15000 as the frontend port.


# Exposing a task without pre-assigned ports

This feature allows you to expose task without a Mesos-assigned port. 

Prior to this feature, Edge-LB only exposed task that have ports assigned by mesos. Its not a requirement for Mesos tasks to have port assigned always. By leveraging this feature, when there is no port assigned for task, an Operator can specify a port in the pool config to expose that task.

# Allow dynamic allocation of the HAProxy frontend port

This feature allows allocating Frontend port dynamically if there is more than on pool on an agent node. 

When a public cloud LB like AWS ELB is sitting in front of Edge-LB, the ELB will handle the proxy/ load-balancing between the Client and Edge-LB pool. In such scenarios having frontend ports doesn't provide much value. By leveraging this feature, you can have multiple Frontend ports allocated dynamiccaly for multiple Edge-LB pools on the same agent for better resource utilization.
