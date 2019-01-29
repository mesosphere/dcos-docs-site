---
layout: layout.pug
navigationTitle: Highly Available Load Balancing on AWS
title: Highly Available Load Balancing on AWS
menuWeight: 20
excerpt:

enterprise: false
---

This tutorial demonstrates how to set up multiple load balancer instances in a single pool behind a single AWS Classic Load Balancer. Similar steps could be followed for AWS Application Load Balancers or AWS Network Load Balancers.

Multiple Edge-LB instances enable you to create a highly available load balanced environment and support increased throughput.

# Prerequisites

* Edge-LB is installed following the [Edge-LB Installation Guide](/services/edge-lb/0.1/installing/).
* The DC/OS CLI is installed and configured to communicate with the DC/OS cluster, and the `edgelb` CLI package has been installed.
* At least one DC/OS private agent node to run the load balanced service (more is preferable).
* Multiple (2 or more) DC/OS public agent nodes in a single VPC. In order to use an AWS ALB or NLB, the agent nodes must be in multiple AZs.
* Permissions to create AWS Load Balancers.

# Environment Set Up

1. Create a Marathon application definition containing the sample service, `customer.json`. It will start 4 instances.

   ```json
   {
     "id": "/customer",
     "instances": 4,
     "cpus": 0.1,
     "mem": 32,
     "cmd": "sed -i 's:Welcome to nginx!:Customer Application:g' /usr/share/nginx/html/index.html; nginx -g 'daemon off;'",
     "container": {
       "portMappings": [{
         "containerPort": 80,
         "hostPort": 0,
         "protocol": "tcp",
         "servicePort": 0,
         "name": "nginx-80"
       }],
       "type": "DOCKER",
       "volumes": [],
       "docker": {
         "image": "nginx"
       }
     },
     "networks": [{
       "mode": "container/bridge"
     }]
   } 
   ```

1. Deploy the sample service.

   ```bash
   dcos marathon app add customer.json
   ```

1. Create an Edge-LB json configuration file with a single Edge-LB pool that has multiple load balancer instances. We will call this file `multi-lb.json`.

   ```json
   {
     "pools": [
       {
         "name": "multi-lb",
         "count": 2,
         "haproxy": {
           "frontends": [{
             "bindPort": 80,
             "protocol": "HTTP",
             "linkBackend": {
               "defaultBackend": "customer-backend"
             }
           }],
           "backends": [{
             "name": "customer-backend",
             "protocol": "HTTP",
             "servers": [{
               "framework": {
                 "value": "marathon"
               },
               "port": {
                 "name": "nginx-80"
               },
               "task": {
                 "value": "customer"
               }
             }]
           }],
           "stats": {
             "bindAddress": "0.0.0.0",
             "bindPort": 9090
           }
         }
       }
     ]
   }
   ```

1. Deploy the Edge-LB configuration.

   ```bash
   dcos edgelb config multi-lb.json
   ```

1. Navigate to the public IP address of each your public nodes. You should be able to see the NGINX web server initial UI.

# Load Balancer Set Up: AWS Classic Load Balancer

The AWS Classic Elastic Load Balancer (Classic ELB) supports both TCP and HTTP connections.

1. In the AWS UI, navigate to the EC2 Load Balancer configuration page: **Services** > **Compute** > **EC2**.

1. Under the 'Load Balancing' section in the menu bar on the left, click on **Load Balancers**.

1. Click **Create Load Balancer**.

1. Under "Classic Load Balancer", click **Create**.

1. On the "Define Load Balancer" page, select these options:
    * Provide a name for your Classic Load Balancer.
    * Select the VPC that your instances are part of.
    * Under "Load Balancer Protocol", specify these settings:
        - Protocol: HTTP
        - Load Balancer Port: 80
        - Instance Protocol: HTTP
        - Instance Port: 80
    * Click the `+` sign next to the subnets that each of your instances are part of.

1. Click **Assign Security Groups**.

1. Create a security group that allows in TCP port 80 from 0.0.0.0/0 (or specify an existing security group), click **Next: Configure Security Settings**, then click **Next: Configure Health Check**.

1. On the "Configure Health Check" page, select these options:
    * Ping Protocol: TCP.
    * Ping Port: 80.
    * Response Timeout: 2.
    * Interval: 5.
    * Unhealthy Threshold: 2.
    * Healthy Threshold: 2.

1. Click **Next: Add EC2 Instances**.

1. On the "Add EC2 Instances" page, select the instances that correspond to your public agent nodes, then click **Next: Add Tags**.

1. Optionally, specify tags for your ELB so you can identify it later, click **Review and Create**, then click **Create**.

On the Load Balancer page, you can check the status of your load balancer by going to **Instances**. It may take a little bit of time for the instances to be registered. Once your instances are properly registered, you should be able to access the load balancer via the Load Balancer name.

# Load Balancer Set Up: AWS Application Load Balancer / Network Load Balancer

The AWS Application Load Balancer (ALB) is a Layer 7 Load Balancer that does HTTP processing; the AWS Network Load Balancer is a Layer 4 Load Balancer that does TCP load balancing. Conceptually they operate as follows:

* ALB: HTTP Load Balancer: HTTP connections terminate on ALB.  
* NLB: TCP Load Balancer: HTTP connections terminate on the EC2 instance itself (in this case, directly on the Edge-LB Load Balancer instance).

Configuration of the two is roughly identical:

1. In the AWS UI, navigate to the EC2 Load Balancer configuration page: **Services** > **Compute** > **EC2**.

1. Under the 'Load Balancing' section in the menu bar on the left, click **Load Balancers**.

1. Click **Create Load Balancer**.

1. Under "Application Load Balancer" (or "Network Load Balancer"), click `Create`.

1. On the "Configure Load Balancer" page, select these options:
    * Provide a name for your Application Load Balancer (or Network Load Balancer).
    * Select **internet-facing** and **ipv4**.
    * In the **Listeners** section, specify **HTTP** and **80** (or **TCP** for a Network Load Balancer).
    * Select the VPC that your instances are part of, and then select the Subnets that your instances are part of.

1. Click **Next: Configure Security Settings**, then **Next: Configure Security Groups**.

1. Create a security group that allows in TCP port 80 from 0.0.0.0/0 (or specify an existing security group), then click **Next: Configure Routing**.

1. On the "Configure Routing" page, make the following selections:
  * Target Group: New Target Group.
  * Name: (Specify a name for your target group).
  * Protocol: HTTP (or TCP for Network Load Balancer).
  * Port: 80.
  * Target Type: Instance.
  * Health Checks: Protocol: HTTP (or TCP for Network Load Balancer).
  * Health Checks: Path: /.

1. Click **Register Targets**.

1. Select your instances, click **Add to Registered**, then click **Next: Review**, and then click **Create**.

After a bit of time, your instances should be available via the DNS name in your newly-generated load balancer.
