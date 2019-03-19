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
* You must have the core DC/OS command-line interface (CLI) installed and configured to communicate with the DC/OS cluster
* You must have the `edgelb` command-line interface (CLI) installed.
* You must have an active and properly-configured DC/OS Enterprise cluster.
* The DC/OS Enterprise cluster must have at least one DC/OS **private agent** node to run the load-balanced service and at least one DC/OS **public agent** node for exposing the load-balanced service.

# Create the sample app definition
1. Create a Marathon application definition containing the service. We will call it `ping.json`. It will start one instance.

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
     "healthChecks": [{
       "protocol": "MESOS_HTTP",
       "path": "/",
       "portIndex": 0,
       "gracePeriodSeconds": 5,
       "intervalSeconds": 10,
       "timeoutSeconds": 10,
       "maxConsecutiveFailures": 3
     }],
     "portDefinitions": [{
       "protocol": "tcp",
       "port": 0,
       "name": "pong"
     }],
     "requirePorts": true
   }
   ```

1. Deploy the service.

   ```bash
   dcos marathon app add ping.json
   ```

1. Create a [pool configuration](/services/edge-lb/1.2/pool-configuration) named `sample-minimal.json`.

   ```json
   {
     "apiVersion": "V2",
     "name": "sample-minimal",
     "count": 1,
     "haproxy": {
       "frontends": [{
         "bindPort": 80,
         "protocol": "HTTP",
         "linkBackend": {
           "defaultBackend": "ping-backend"
         }
       }],
       "backends": [{
         "name": "ping-backend",
         "protocol": "HTTP",
         "services": [{
           "marathon": {
             "serviceID": "/ping"
           },
           "endpoint": {
             "portName": "pong"
           }
         }]
       }]
     }
   }
   ```

1. Deploy the Edge-LB pool configuration.

   ```bash
   dcos edgelb create sample-minimal.json
   ```

1. Find the private IP addresses of the node(s) that the Edge-LB load balancers are running on with the following command:

   ```
   dcos edgelb endpoints sample-minimal
   ```

   You can then use this information to determine the public IP address to use to access the load balancer.
   
   For more information about finding public IP addresses for your cluster, see [Finding a public agent IP](/1.13/administering-clusters/locate-public-agent/).

1. After the pool and service have been deployed, access the load-balanced service at `http://<public-ip>/`.

1. Verify you have access to the app.