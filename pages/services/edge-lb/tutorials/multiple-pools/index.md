---
layout: layout.pug
navigationTitle: Exposing multiple services using multiple pools
title: Exposing multiple services using multiple pools
menuWeight: 7
excerpt: How to set up load balancing for multiple services using multiple Edge-LB pool instances
enterprise: true
---
This tutorial demonstrates how to deploy three services with three different Edge-LB pool instances, with one pool instance per service. You typically implement this type of deployment scenario to provide high availability when you have multiple services with high demand, that require added capacity to ensure reliability and responsiveness, or that involve transaction processing with high resource consumption or performance overhead. 

For example, if you have ten services running on a DC/OS Enterprise cluster, you might want to configure ten separate Edge-LB pool instances, with one pool per service, to distribute the traffic for all ten services. If a fault occurs with one of the pools in the cluster, the disruption is contained to only affect that service in the pool instance. Other services continue routing traffic to the correct backend instances without interruption.

# Before you begin
* You must have Edge-LB installed as described in the Edge-LB [installation instructions](/services/edge-lb/getting-started/installing).
* You must have the core DC/OS command-line interface (CLI) installed and configured to communicate with the DC/OS cluster.
* You must have the `edgelb` command-line interface (CLI) installed.
* You must have an active and properly-configured DC/OS Enterprise cluster.
* The DC/OS Enterprise cluster must have at least one DC/OS **private agent** node to run the load-balanced service and at least one DC/OS **public agent** node for exposing the load-balanced service.

# Create and deploy the ping sample app
1. Open a text editor to create the sample app definition for the `ping` service in the `ping.json` file:

    ```bash
    vi ping.json
    ```

1. Copy and paste the following JSON settings and save the `ping.json` file:

    ```json
    {
      "id": "/ping",
      "cpus": 0.1,
      "mem": 32,
      "instances": 1,
      "cmd": "echo \"pong\" > index.html && python -m http.server $PORT0",
      "container": {
        "type": "DOCKER",
        "docker": {
          "image": "python:3"
        }
      },
      "healthChecks": [
      {
        "protocol": "MESOS_HTTP",
        "path": "/",
        "portIndex": 0,
        "gracePeriodSeconds": 5,
        "intervalSeconds": 10,
        "timeoutSeconds": 10,
        "maxConsecutiveFailures": 3
      }
      ],
      "portDefinitions": [
      {
        "protocol": "tcp",
        "port": 0,
        "name": "pong-port"
      }
      ],
      "requirePorts": true
    }
    ```

1. Deploy the `ping.json` sample app definition:

    ```bash
    dcos marathon app add ping.json
    ```

# Create the ping service-specific pool
1. Open a text editor to create the sample pool configuration file for the `ping` services in the `ping-lb-pool.json` file:

    ```bash
    vi ping-lb-pool.json
    ```

1. Copy and paste the following JSON settings and save the `ping-lb-pool.json` file:

    ```json
    {
      "apiVersion": "V2",
      "name": "ping-lb-pool",
      "count": 5,
      "haproxy": {
        "frontends": [
        {
          "bindPort": 15001,
          "protocol": "HTTP",
          "linkBackend": {
            "defaultBackend": "ping-backend"
          }
        }
      ],
        "backends": [
        {
          "name": "ping-backend",
          "protocol": "HTTP",
          "services": [
          {
            "marathon": {
              "serviceID": "/ping"
            },
            "endpoint": {
              "portName": "pong-port"
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

1. Deploy the Edge-LB pool instance to expose and access the `ping` service using the `ping-lb-pool.json` pool configuration file:

    ```bash
    dcos edgelb create ping-lb-pool.json
    ```

# Create and deploy the nginx sample app
1. Open a text editor to create the sample app definition for the `nginx` service in the `nginx.json` file:

    ```bash
    vi nginx.json
    ```

1. Copy and paste the following JSON settings and save the `nginx.json` file:

    ```json
    {
      "id": "/nginx",
      "cpus": 0.1,
      "instances": 1,
      "mem": 128,
      "container": {
        "portMappings": [
          {
            "containerPort": 80,
            "protocol": "tcp",
            "name": "nginx-port"
          }
        ],
        "type": "MESOS",
        "docker": {
          "image": "nginx"
        }
      },
      "networks": [
        {
          "mode": "container/bridge"
        }
    ]
    }
    ```

1. Deploy the `nginx.json` sample app definition:

    ```bash
    dcos marathon app add nginx.json
    ```

# Create the nginx service-specific pool
1. Open a text editor to create the sample pool configuration file for the `nginx` services in the `nginx-lb-pool.json` file:

    ```bash
    vi nginx-lb-pool.json
    ```

1. Copy and paste the following JSON settings and save the `nginx-lb-pool.json` file:

    ```json
    {
      "apiVersion": "V2",
      "name": "nginx-lb-pool",
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

1. Deploy the Edge-LB pool instance to expose and access the `nginx` service using the `nginx-lb-pool.json` pool configuration file:

    ```bash
    dcos edgelb create nginx-lb-pool.json
    ```

# Create and deploy the echo sample app
1. Open a text editor to create the sample app definition for the `echo` service in the `echo.json` file:

    ```bash
    vi echo.json
    ```

1. Copy and paste the following JSON settings and save the `echo.json` file:

    ```json
    {
      "id": "/echo",
      "args": [
        "-listen", ":80",
        "-text", "\"Hello from Marathon!\""
      ],
      "cpus": 0.1,
      "instances": 1,
      "mem": 128,
      "container": {
        "portMappings": [
          {
            "containerPort": 80,
            "protocol": "tcp",
            "name": "echo-port"
          }
        ],
        "type": "MESOS",
        "docker": {
          "image": "hashicorp/http-echo"
        }
      },
      "networks": [
        {
          "mode": "container/bridge"
        }
    ]
    }
    ```

1. Deploy the `echo.json` sample app definition:

    ```bash
    dcos marathon app add echo.json
    ```

# Create the echo service-specific pool
1. Open a text editor to create the sample pool configuration file for the `echo` services in the `echo-lb-pool.json` file:

    ```bash
    vi echo-lb-pool.json
    ```

1. Copy and paste the following JSON settings and save the `echo-lb-pool.json` file:

    ```json
    {
      "apiVersion": "V2",
      "name": "echo-lb",
      "count": 1,
      "haproxy": {
        "frontends": [
        {
          "bindPort": 15003,
          "protocol": "HTTP",
          "linkBackend": {
            "defaultBackend": "echo-backend"
          }
        }
      ],
        "backends": [
        {
          "name": "echo-backend",
          "protocol": "HTTP",
          "services": [
          {
            "marathon": {
              "serviceID": "/echo"
            },
            "endpoint": {
              "portName": "echo-port"
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

1. Deploy the Edge-LB pool instance to expose and access the `echo` service using the `echo-lb-pool.json` pool configuration file:

    ```bash
    dcos edgelb create echo-lb-pool.json
    ```

# Verify deployment status
1. Verify all services and pool instances have been deployed sucessfully by running the following command: 

    ```bash
    dcos marathon app list
    ```

1. Verify the pool configuration for frontend and stats ports by running the following command: 

    ```bash
    dcos edgelb list
    ```

1. Verify the Mesos tasks for the services and the Edge-LB pool instances by running the following command: 

    ```bash
    dcos task
    ```

1. Verify the pool configuration endpoints for each Edge-LB pool by running the following commands: 

    ```bash
    dcos edgelb endpoints ping-lb
      NAME            PORT   INTERNAL IP
      frontend_port0  15001  10.0.5.202
      stats_port      1025   10.0.5.202

    dcos edgelb endpoints nginx-lb
      NAME            PORT   INTERNAL IP
      frontend_port0  15002  10.0.7.138
      stats_port      1025   10.0.7.138

    dcos edgelb endpoints echo-lb
      NAME            PORT   INTERNAL IP
      frontend_port0  15003  10.0.7.138
      stats_port      1026   10.0.7.138
    ```

# Verify service access using frontend ports
1. Verify that you can access the following deployed services using the public IP address and the assigned frontend ports.

    - `ping` service:
      ```bash
      http://<public_agent_public_IP>:15001
      ```
    - `nginx` service:
      ```bash
      http://<public_agent_public_IP>:15002
      ```
    - `echo` service:
      ```bash
      http://<public_agent_public_IP>:15003
      ```

    In this tutorial, the `ping` load balancing service frontend port is 15001 and the port for HAProxy statistics is 1025. If the public IP address for the public agent node is 34.211.65.249, you could access the service by opening a web browser and specifying `34.211.65.249:15001` and the load balancing statistics for the the service by specifying `34.211.65.249:15001/haproxy?stats`.

    When you navigate to the public IP address and specified port for each load balanced service, you should see the following pages:
    - `pong`
    - `Welcome to Nginx`
    - `Hello from Marathon!` 

    If you cannot access one of the pages, check that the Edge-LB frontend ports do not conflict with other ports you are currently using.

    If you are deploying multiple Edge-LN pool instances, you should also be sure that the Edge-LB pool instance names are unique. For example, the pool instance names used in this tutorial are `ping-lb-pool`, `nginx-lb-ppool`, and `echo-lb-pool` so that the instance names do not duplicate the pool names used in other examples or tutorials. 
