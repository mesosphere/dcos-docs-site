---
layout: layout.pug
navigationTitle: Load Balance and Expose a Service
title: Load Balance and Expose a Service
menuWeight: 10
excerpt:

enterprise: false
---

This tutorial demonstrates how to load balance a DC/OS service and set it up for access outside of the cluster.

## Prerequisites

* Edge-LB is installed following the [Edge-LB Installation Guide](/services/edge-lb/0.1/installing/).
* The DC/OS CLI is installed and configured to communicate with the DC/OS cluster, and the `edgelb` CLI package has been installed.
* At least one DC/OS private agent node, to run the load balanced service (more is preferable).
* At least one DC/OS public agent node.

1. Create a Marathon application definition containing the service. We will call it `ping.json`. It will start 1 instance.

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

1. Create a [pool configuration](/services/edge-lb/0.1/pool-configuration/).

   ```json
   {
     "pools": [{
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
           "servers": [{
             "framework": {
               "value": "marathon"
             },
             "task": {
               "value": "ping"
             },
             "port": {
               "name": "pong"
             }
           }]
         }]
       }
     }]
   }
   ```

1. Deploy the Edge-LB configuration.

   ```bash
   dcos edgelb config sample-minimal.json
   ```

1. Once the pool and service have been deployed, access the `host-httpd` service at `http://<public-ip>/`.

   You can find the private IP(s) (that DC/OS was configured with) of the node(s) that the Edge-LB load balancers are running on with the following command:
  
   ```
   dcos edgelb pool status sample-minimal --ip-only
   ```

   You can then use this information to determine the public IP that you would like to use to access the load balancer. You can also use this technique to discover public IP addresses for your cluster: [Finding a Public Agent IP](https://docs.mesosphere.com/1.10/administering-clusters/locate-public-agent/).
