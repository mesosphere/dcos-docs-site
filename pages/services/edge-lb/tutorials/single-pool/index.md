---
layout: layout.pug
navigationTitle: Exposing multiple services in a single pool
title: Exposing multiple services in a single pool
menuWeight: 6
excerpt: How to load balance multiple services in a single Edge-LB instance
enterprise: true
---
This tutorial demonstrates how to set up three services with a single Edge-LB pool instance. This flexibility allows you to configure Edge-LB pools depending on your needs to achieve high availability in your environment. For example, if you have 90 services running on the DC/OS cluster, you can configure 30 Edge-LB pool instances with 3 services each to load balance all 90 services.

# Before you begin
* You must have Edge-LB installed as described in the Edge-LB [installation instructions](/services/edge-lb/getting-started/installing).
* You must have the core DC/OS command-line interface (CLI) installed and configured to communicate with the DC/OS cluster.
* You must have the `edgelb` command-line interface (CLI) installed.
* You must have an active and properly-configured DC/OS Enterprise cluster.
* The DC/OS Enterprise cluster must have at least one DC/OS **private agent** node to run the load-balanced service and at least one DC/OS **public agent** node for exposing the load-balanced service.

# Create and deploy sample apps
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

1. Open a text editor, then copy and paste the following sample app definition to create the `nginx.json` file: 

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

1. Open a text editor, then copy and paste the following sample app definition to create the `echo.json` file:

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
# Create the Edge-LB pool configuration file
1. Open a text editor to create the sample pool configuration file for the deployed services in the `multi-lb-pool.json` file:

    ```bash
    vi multi-lb-pool.json
    ```

1. Copy and paste the following JSON settings and save the `multi-lb-pool.json` file:

    ```json
    {
      "apiVersion": "V2",
      "name": "multi-lb",
      "count": 1,
      "haproxy": {
        "frontends": [
        {
          "bindPort": 15001,
          "protocol": "HTTP",
          "linkBackend": {
            "defaultBackend": "ping-backend"
          }
        },
        {
          "bindPort": 15002,
          "protocol": "HTTP",
          "linkBackend": {
            "defaultBackend": "nginx-backend"
          }
        },
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
        },
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
        },
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

1. Deploy the Edge-LB pool instance to expose and access all three services using the `multi-lb.json` pool configuration file:

    ```bash
    dcos edgelb create multi-lb-pool.json
    ```

# Verify deployment status
1. Verify that the services and the pool instance have been deployed sucessfully by running the following command: 

    ```bash
    dcos marathon app list
    ```

1. Verify the pool configuration for frontend and stats ports by running the following command: 

    ```bash
    dcos edgelb list
    ```

1. Verify the pool-related configuration settings by running the following command: 

    ```bash
    dcos edgelb show multi-lb
    ```

1. Verify the Mesos tasks for the services and the Edge-LB pool instances by running the following command: 

    ```bash
    dcos task
    ```

1. Verify that the Edge-LB pool instance was deployed successfully with the configured frontend and backend ports: 

    ```bash
    dcos edgelb endpoints multi-lb
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

    When you navigate to the public IP address and specified port, you should see the following pages:
    - `pong`
    - `Welcome to Nginx`
    - `Hello from Marathon!` 

    If you cannot access one of the pages, check that the Edge-LB frontend ports do not conflict with other ports you are currently using.
