---
layout: layout.pug
navigationTitle:  Blue/Green service deployment
title: Phased "Blue/Green" service deployment
menuWeight: 10
excerpt: How to deploy with two load-balanced versions of the same service
enterprise: true
---
A blue/green deployment strategy provides a method for achieving zero-downtime when you need to run two versions of the same service--that is, a "blue" version and a "green" version--simultaneously. With a blue/green deployment, you can have two fully-scaled versions of the same service running at the same time on the same cluster. You can then use the load balancer to switch between the two versions, as needed.

This type of deployment supports rolling updates where one version of a service can be taken down and upgraded or rolled back without distrupting access to the other version of the same service. Similarly, if something goes wrong with one version of a service, you can quickly switch to routing requests to the other version of the service by adjusting the load balancer settings.

# Before you begin
Before you create Edge-LB pools and pool configuration files, you should have DC/OS Enterprise cluster nodes installed and ready to use and have previously downloaded and installed the latest Edge-LB packages.

* You must have Edge-LB installed as described in the Edge-LB [installation instructions](/services/edge-lb/getting-started/installing).
* You must have the core DC/OS command-line interface (CLI) installed and configured to communicate with the DC/OS cluster.
* You must have the `edgelb` command-line interface (CLI) installed.
* You must have an active and properly-configured DC/OS Enterprise cluster.
* The DC/OS Enterprise cluster must have at least one DC/OS **private agent** node to run the load-balanced service and at least one DC/OS **public agent** node for exposing the load-balanced service.
* You must have enough capacity on the DC/OS Enterprise cluster for two fully-deployed services.

For information about installing Edge-LB packages, see the [installation](/services/edge-lb/getting-started/installing/) instructions.

# Preview of what you'll do
This tutorial illustrates how to configure services and load balancing to support a blue/green deployment scenario. In this tutorial, you will:
- Create and deploy a load balancing configuration file for a sample `web-server` application identified as the "blue" version of the service.
- Create and deploy a load balancing configuration file for a second "green" version of the `web-server` application.
- Verify the load balancer is routing traffic successfully to the "blue" version of the service.
- Update the Edge-LB configuration to route traffic to the "green" version of the service.
- Verify the load balancer routes traffic to the "green" version of the service.
- Access the sample application through the public agent IP address and frontend port.

By completing the steps in this tutorial, you can see how to switch to a newer or different version of the same service with zero-downtime and have the Edge-LB load balancer automatically adjust the traffic routed between the blue and green versions of the service. 

# Create and deploy the "blue" sample app definition
1. Open a text editor to create the sample app definition for the `svc-blue` service in the `svc-blue.json` file:

    ```bash
    vi svc-blue.json
    ```

1. Copy and paste the following JSON settings and save the `svc-blue.json` file:

    ```json
    {
        "id": "/svc-blue",
        "cmd": "/start $PORT0",
        "instances": 1,
        "cpus": 0.1,
        "mem": 32,
        "container": {
            "type": "DOCKER",
            "docker": {
                "image": "mesosphere/httpd"
            }
        },
        "portDefinitions": [
            {
                "name": "web",
                "protocol": "tcp",
                "port": 0
            }
        ],
        "healthChecks": [
            {
                "portIndex": 0,
                "path": "/",
                "protocol": "HTTP"
            }
        ]
    }
    ```

# Create and deploy the "green" sample app definition
1. Open a text editor to create the sample app definition for the `svc-green` service in the `svc-green.json` file:

    ```bash
    vi svc-green.json
    ```

1. Copy and paste the following JSON settings and save the `svc-green.json` file:

    ```json
    {
        "id": "/svc-green",
        "cmd": "/start $PORT0",
        "instances": 1,
        "cpus": 0.1,
        "mem": 32,
        "container": {
            "type": "DOCKER",
            "docker": {
                "image": "mesosphere/httpd"
            }
        },
        "portDefinitions": [
            {
                "name": "web",
                "protocol": "tcp",
                "port": 0
            }
        ],
        "healthChecks": [
            {
                "portIndex": 0,
                "path": "/",
                "protocol": "HTTP"
            }
        ]
    }
    ```

# Configure load balancing for the "blue" service
1. Open a text editor to create the pool configuration file
for the sample service in the `sample-deployment-config.json` file:

    ```bash
    vi sample-deployment-config.json
    ```

1. Copy and paste the following JSON settings and save the `sample-deployment-config.json` file:

    ```json
    {
      "apiVersion": "V2",
      "name": "sample-deployment-config",
      "count": 1,
      "haproxy": {
        "frontends": [{
          "bindPort": 80,
          "protocol": "HTTP",
          "linkBackend": {
            "defaultBackend": "svc"
          }
        }],
        "backends": [{
          "name": "svc",
          "protocol": "HTTP",
          "services": [{
            "marathon": {
              "serviceID": "/svc-blue"
              },
              "endpoint": {
                "portName": "web"
              }
          }]
        }]
      }
    }
    ```

1. Deploy the Edge-LB pool configuration file for the sample service by running the following command:

   ```
   dcos edgelb create sample-deployment-config.json
   ```

1. Start deployment for the `svc-blue.json` app definition by running the following command:

   ```bash
   dcos marathon app add svc-blue.json
   ```

# Verify deployment status for the "blue" service
1. Verify the `sample-deployment-config.json` Edge-LB pool configuration file is configured and deployed correctly by running the following command:

    ```bash
    dcos edgelb show sample-deployment-config.json
    ```

1. Verify the "svc-blue" app is exposed by navigating to the public-facing IP address for the public agent node.

    ```bash
    http://<public_agent_public_IP>
    ```
    
    You don't need to specify the port in this example because the access to the service is routed through the default port 80 for HTTP traffic.

    For information about how to find the IP address for a public agent, see [Finding a public agent IP](/1.13/administering-clusters/locate-public-agent/).

# Deploy the "green" version of the sample service
1. Start deployment for the `svc-green.json` app definition by running the following command:

   ```bash
   dcos marathon app add svc-green.json
   ```

1. Verify the blue and green versions of the sample service and the Edge-LB pool instance have been deployed sucessfully by running the following command: 

    ```bash
    dcos marathon app list
    ```

1. Modify the Edge-LB pool configuration file to point to `svc-green` by changing the `serviceID` setting.

    For example:

      ```json
    {
      "apiVersion": "V2",
      "name": "sample-deployment-config",
      "count": 1,
      "haproxy": {
        "frontends": [{
          "bindPort": 80,
          "protocol": "HTTP",
          "linkBackend": {
            "defaultBackend": "svc"
          }
        }],
        "backends": [{
          "name": "svc",
          "protocol": "HTTP",
          "services": [{
            "marathon": {
              "serviceID": "/svc-green"
              },
              "endpoint": {
                "portName": "web"
              }
          }]
        }]
      }
    }
    ```

1. Deploy the modified pool configuration file to Edge-LB.

   ```
   dcos edgelb update sample-deployment-config.json
   ```

1. Verify the "svc-green" app is exposed by navigating to the public-facing IP address for the public agent node.

    ```bash
    http://<public_agent_public_IP>
    ```
    