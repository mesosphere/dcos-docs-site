---
layout: layout.pug
navigationTitle: Comparing Edge-LB to Marathon-LB
title: Comparing Edge-LB to Marathon-LB
menuWeight: 16
excerpt: Demonstrates differences between Marathon-LB and Edge-LB load balancing services
enterprise: true
---
This tutorial demonstrates exposing and accessing the `nginx` service by using Marathon-LB and Edge-LB. It demonstrates the differences in configuration in terms of both load balancers. 

# Before you begin
* You must have the Edge-LB API server installed as described in the Edge-LB [installation instructions](/services/edge-lb/getting-started/installing).
* You must have the DC/OS command-line interface (CLI) installed and configured to communicate with the DC/OS cluster.
* You must have the `edgelb` command-line interface (CLI) installed.
* You must have an active and properly-configured DC/OS Enterprise cluster.
* The DC/OS Enterprise cluster must have at least one DC/OS **private agent** node to run the load-balanced service and at least one DC/OS **public agent** node for exposing the load-balanced service.
* You must have Marathon-LB installed as described in the Marathon-LB [installation instructions](/services/marathon-lb/1.12.x/mlb-install).

# Preview of what you'll do
This tutorial illustrates the differences between configuring load balancing using Marathon-LB and an Edge-LB pool to provide public access to a simple Marathon app. In this tutorial, you will:
- Create and deploy a sample Marathon app called `nginx`.
- Configure and deploy Marathon-LB using the Marathon service `nginx-mlb`.
- Configure and deploy load balancing using the Edge-LB pool instance called `nginx-edgelb`.
- Access the sample `nginx` app through the public agent URL. 

# Configure the sample app for Marathon-LB
1. Open a text editor, then copy and paste the following sample app definition to create the `nginx-mlb.json` file:

    ```json
    {
      "id": "/nginx-mlb",
      "cpus": 0.1,
      "instances": 1,
      "mem": 128,
      "cmd": "sed -i 's:Welcome to nginx!:Welcome to nginx! - through Marathon-LB:g' /usr/share/nginx/html/index.html; nginx -g 'daemon off;'",
      "container": {
        "portMappings": [
          {
            "containerPort": 80,
            "protocol": "tcp",
            "servicePort": 10020
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
    ],
      "labels": {
        "HAPROXY_GROUP": "external",
        "HAPROXY_0_STICKY": "true",
        "HAPROXY_0_VHOST": "<Public agent IP address>"
      }
    }
    ```

    This sample app definition for `nginx-mlb.json` includes the public IP address used to expose and access the `nginx` service.

1. Deploy the `nginx` service by adding the `nginx-mlb.json` app definition to the cluster:

    ```bash
    dcos marathon app add nginx-mlb.json
    ```

1. Verify access to the service by opening a web browser and navigating to the public agent IP address and service port defined in the `nginx-mlb.json` file.

    ```bash
    http://<Public agent IP address>:10020
    ```

    The previous steps illustrate how you can deploy the `nginx` service through Marathon-LB.

# Configure Edge-LB for the sample app
1. Open a text editor, then copy and paste the following sample app definition to create the `nginx.json` file:

    ```json
    {
      "id": "/nginx",
      "cpus": 0.1,
      "instances": 1,
      "mem": 128,
      "cmd": "sed -i 's:Welcome to nginx!:Welcome to nginx! - through Edge-LB:g' /usr/share/nginx/html/index.html; nginx -g 'daemon off;'",
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

1. Deploy the `nginx` app using the following command:

    ```bash
    dcos marathon app add nginx.json
    ```

1. Open a text editor, then copy and paste the following to create the `nginx-edgelb.json` pool configuration file to expose and access the `nginx` service:

    ```json
    {
      "apiVersion": "V2",
      "name": "nginx-edgelb",
      "count": 1,
      "haproxy": {
        "frontends": [
        {
          "bindPort": 15001,
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
          "bindPort": 1025
        }
      }
    }
    ```

1. Deploy the Edge-LB pool configuration file to expose and access the `nginx` service by running the following command:

    ```bash
    dcos edgelb create nginx-edgelb.json
    ```

# Verify deployment status for sample apps
1. Verify Marathon-LB and Edge-LB API server packages has been deployed sucessfully by running the following command:

    ```bash
    dcos package list
    ```

1. Verify the services and pool instances has been deployed sucessfully by running the following command:

    ```bash
    dcos marathon app list
    ```

1. Verify the mesos task relevant to services and the pool instances by running the following command:

    ```bash
    dcos task
    ```

1. Verify that the Edge-LB pool named `nginx-edgelb` has been deployed successfully by running the following command:

    ```bash
    dcos edgelb list
    ```

1. Verify that the Edge-LB pool instance was deployed successfully with the configured frontend and backend ports by running the following command:

    ```bash
    dcos edgelb endpoints nginx-edgelb
    ```
# Verify service access
1. Access the `nginx-mlb` service using the public IP address and port specified in the `nginx-mlb.json` file.

    ```bash
    http://<public_agent_public_IP>:10020
    ```

    You should see a page for `Welcome to Nginx - through Marathon-LB`. For example: 
    <p>
    <img src="/services/edge-lb/img/Edge-MLB-nginx.png" alt="Welcome page for a service using Marathon-LB">
    </p>

1. View the load balancing statistics for the `nginx` service deployed using Marathon-LB using the default HAProxy `stats` port 9090:

    ```bash
    http://<public_agent_public_IP>:9090
    ```
    For example:
    <p>
    <img src="/services/edge-lb/img/Edge-HAProxy-stats.png" alt="Statistics for a service exposed using Marathon-LB">
    </p>

1. Access the `nginx` service that was exposed through Edge-LB using the public agent IP and the frontend port number. 

    ```bash
    http://<public_agent_public_IP>:15001
    ```
    You should see a page for `Welcome to Nginx - through Edge-LB`. For example:

    <p>
    <img src="/services/edge-lb/img/Edge-LB-welcome-nginx.png" alt="Welcome page for a service using Edge-LB">
    </p>

1. View the load balancing statistics for the `nginx` service deployed using Edge-LB using the predefined HAProxy `stats` port 1025:

    ```bash
    http://<public_agent_public_IP>:1025
    ```
    
    For example:
    <p>
    <img src="/services/edge-lb/img/Edge-HAProxy-stats-2.png" alt="Statistics for a service exposed using Edge-LB">
    </p>
