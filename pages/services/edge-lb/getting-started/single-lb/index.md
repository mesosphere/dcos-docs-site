---
layout: layout.pug
navigationTitle: Expose and load balance a service
title: Expose and load balance a sample service
menuWeight: 10
excerpt: Illustrates the basic steps for load balancing a single service running on DC/OS
enterprise: true
---

This tutorial demonstrates how to prepare load balancing for access to a single DC/OS service. For this tutorial, the access requests originate outside of the DC/OS cluster and are routed into the cluster through a public-facing IP address. This scenario illustrates the most common way orgnaizations get started with a load balancing solution.

# Before you begin
* You must have Edge-LB installed as described in the Edge-LB [installation instructions](/services/edge-lb/getting-started/installing).
* You must have the core DC/OS command-line interface (CLI) installed and configured to communicate with the DC/OS cluster.
* You must have the `edgelb` command-line interface (CLI) installed.
* You must have an active and properly-configured DC/OS Enterprise cluster.
* The DC/OS Enterprise cluster must have at least one DC/OS **private agent** node to run the load-balanced service and at least one DC/OS **public agent** node for exposing the load-balanced service.

# Preview of what you'll do
This tutorial illustrates how to configure an Edge-LB instance to provide public access to a simple Marathon app. In this tutorial, you will:
- Create and deploy a sample Marathon app called `ping`.
- Expose the `ping` app through the Edge-LB pool instance called `ping-lb`.
- Access the sample `ping` app through the public agent URL. 

# Create the sample app definition
1. Open a text editor, then copy and paste the following sample app definition to create the `ping.json` file:

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

  In this sample app defintion, notice that the `portDefinitions.name` field matches the `haproxy.backends.endpoint.portName` setting. If these fields don't match, the pool will not deploy successfully.

1. Deploy the `ping` service by installing the `ping.json` app definition:

  ```bash
  dcos marathon app add ping.json
  ```

# Create the Edge-LB pool configuration file
1. Open a text editor, then copy and paste the following Edge-LB pool configuration settings to create the `ping-lb.json` Edge-LB pool instance:

```json
{
  "apiVersion": "V2",
  "name": "ping-lb",
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

1. Review the configuration settings to verify they meet the following requirements:
    - The `name` indicates the pool instance name. In this sample pool configuration file, the instance name is `ping-lb` and you must have this information to edit, update, or delete the Edge-LB pool instance after you deploy it.
    - The `haproxy.frontends.linkBackend.defaultBackend` must match the `haproxy.backends.name` value. In this sample pool configuration file, the backend name is `ping-backend`. 
    - The `haproxy.backends.endpoint.portName` in the pool configuration file must match the `portDefinitions.name` in the app definition file. In this sample pool configuration file, the name is `pong-port`. 
    - The `haproxy.frontends.bindPort` setting indicates the port used to access the app. In this sample pool configuration file, the app is accessible on port 15001.
    - The `haproxy.stats.bindPort` setting indicates that the port for load-balancing statistics will be dynamically allocated.
    - The `haproxy.backends.marathon.serviceID` must match the name of the app definition. In this sample pool configuration file, the service name is `\ping`.

# Deploy a Edge-LB pool to expose the service

1. Deploy the `ping-lb.json` pool configuration file to create the `ping-lb` pool instance for load balancing access to the `ping` service:

  ```bash
  dcos edgelb create ping-lb.json
  ```

1. Verify the services and the pool instance has been deployed sucessfully by running the following command: 

    ```bash
    dcos marathon app list
    ```

1. Verify the pool configuration for the frontend and statistics ports by running the following command: 

    ```bash
    dcos edgelb list
    ```

1. Verify the tasks associated with the deployed services and the pool instance by running the following command: 

    ```bash
    dcos task
    ```

1. Verify that the Edge-LB pool instance was deployed successfully with the configured frontend and backend ports by running the following command: 

    ```bash
    dcos edgelb endpoints ping-lb
    ```

    For example, you might see output similar to the following:
    ```bash
    dcos edgelb endpoints ping-lb
      NAME            PORT   INTERNAL IP
      frontend_port0  15001  10.0.5.202
      stats_port      1025   10.0.5.202
    ```

    In this example, the `ping-lb` pool instance uses the frontend port 15001 and the statistics port 1025. 

1. Verify the Edge-LB pool configuration status by running the following command:

    ```bash
    dcos edgelb status ping-lb
    ```

1. View the Edge-LB pool configuration file in JSON format by running the following command: 

    ```bash
    dcos edgelb show ping-lb --json
    ```

# Access the services
1. Verify that you can access the following deployed services by opening a web browser and navigating to the public-facing IP address and the frontend port 15001:

    ```bash
    http://<public_agent_public_IP>:15001
    ```

    If the services and load balancing pool are properly configured and deployed, you can verify access to the following pages:
    - `pong`
    - `Welcome to Nginx`
    - `Hello from Marathon!`

1. Example Edge-LB pool config files for these deployed services: 

The public IP of the public agent is 34.211.65.249. You could access the `pong` service by going to: 34.211.65.249:15001 and the stats for HAProxy by going to 34.211.65.249:15001/haproxy?stats page

**NOTE**: If you cannot access one of the pages, please ensure that configured Edge-LB frontend ports do not have conflict with other port that may be in use.

When deploying multiple edge-lb pool instances, be careful to have the Edge-LB pool instance names are unique. For example in this tutorial, the pool instances were `ping-lb`, `nginx-lb`, and `echo-lb`. 

You can then use this information to determine the public IP address to use to access the load balancer. For more information about finding public IP addresses for your cluster, see [Finding a public agent IP](/1.13/administering-clusters/locate-public-agent/).

Access the load-balanced service at `http://<public-ip>/` to verify you have access to the app.
