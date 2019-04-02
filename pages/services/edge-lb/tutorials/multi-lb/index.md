---
layout: layout.pug
navigationTitle: Highly-available load balancing on AWS
title: Highly-available load balancing on AWS
menuWeight: 5
excerpt: How to set up multiple load balancer instances for a DC/OS cluster running on AWS
enterprise: true
---
This tutorial demonstrates how to set up multiple Edge-LB load balancer instances in a single pool behind a single Amazon Web Services (AWS) Classic Load Balancer. You can perform similar steps to configure Edge-LB load balancers for AWS Application Load Balancers or AWS Network Load Balancers. In the scenario for this tutorial, you can use multiple Edge-LB pool instances to create a highly-available load balanced environment on a DC/OS cluster running on a public cloud instance. Using Edge-LB in combination with a public cloud load balancing service like AWS Classis Load Balancer improves network efficiency, application performance, and processing throughput.

# Before you begin
* You must have Edge-LB installed as described in the Edge-LB [installation instructions](/services/edge-lb/getting-started/installing).
* You must have the core DC/OS command-line interface (CLI) installed and configured to communicate with the DC/OS cluster.
* You must have the `edgelb` command-line interface (CLI) installed.
* You must have an active and properly-configured DC/OS Enterprise cluster.
* The DC/OS Enterprise cluster must have at least one DC/OS **private agent** node to run the load-balanced service.
* The DC/OS Enterprise cluster must have two or more **public agent** nodes running in the virtual private cloud (VPC) of shared computing resources 
* You must have a cloud provider account with sufficient permissions to create and manage AWS load balancers.

If you plan to adapt this tutorial to use Edge-LB with AWS Application Load Balancers or AWS Network Load Balancers, you must have the DC/OS agent nodes configured for multiple AWS availability zones.

# Create the sample app definition
1. Open a text editor to create the sample app definition for the `customer` service in the `customer.json` file:

    ```bash
    vi customer.json
    ```

1. Copy and paste the following JSON settings and save the `customer.json` file:

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

    This sample application starts four instances.

1. Start deployment for the `customer.json` app definition by running the following command:

   ```bash
   dcos marathon app add customer.json
   ```

# Configure load balancing for the sample service
1. Open a text editor to create the pool configuration file
for the sample service in the `multi-lb-config.json` file:

    ```bash
    vi multi-lb-config.json
    ```

1. Copy and paste the following JSON settings and save the `multi-lb-config.json` file:

   ```json
   {
     "apiVersion": "V2",
     "name": "multi-lb-config",
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
         "services": [{
           "marathon": {
             "serviceID": "/customer"
           },
           "endpoint": {
             "portName": "nginx-80"
           }
         }]
       }],
       "stats": {
         "bindAddress": "0.0.0.0",
         "bindPort": 9090
       }
     }
   }
   ```

    This sample Edge-LB pool configuration file defines a single Edge-LB pool with multiple load balancer instances.

1. Deploy the Edge-LB configuration.

   ```bash
   dcos edgelb create multi-lb-config.json
   ```

1. Navigate to the public IP address of each your public nodes. You should be able to see the NGINX web server initial UI.

# Prepare the external load balancer
This tutorial illustrates load balancing for a DC/OS cluster running on an Amazon Web Services (AWS) public or private cloud instance. AWS supports three types of Elastic Load Balancing solutions:
- Application Load Balancers
- Network Load Balancers
- Classic Load Balancers

This tutorial focuses on using Edge-LB with Amazon Web Services (AWS) classic load balancers. The AWS Elastic classic load balancer supports TCP, SSL/TLS, HTTP,  and HTTPS connections for both EC2-Classic and virtual private cloud (VPC) cluster deployments.

## Create a classic load balancer
1. Open the AWS Management Console for your cloud instances.

1. Click **Services**, **Compute**, then **EC2** to navigate to the EC2 Load Balancer configuration page.

1. Under Load Balancing, in the menu on the left, click **Load Balancers**.

1. Click **Create Load Balancer**.

1. Under Classic Load Balancer, click **Create**.

1. On the Define Load Balancer page:
    * Provide a name for your Classic Load Balancer.
    * Select the VPC that your instances are part of.
    * Specify the following settings under Load Balancer Protocol:
        - Protocol: HTTP
        - Load Balancer Port: 80
        - Instance Protocol: HTTP
        - Instance Port: 80
    * Click the **+** sign next to the subnets that each of your instances are part of.

## Configure settings for the classic load balancer
1. Click **Assign Security Groups**.

1. Create a security group that allows inbound TCP traffic on port 80 from 0.0.0.0/0.

    Alternatively, you can specify an existing security group that allows inbound traffic on port 80 if you have previously configured an appropriate security group.

1. Click **Next: Configure Security Settings** to continue.

1. Click **Next: Configure Health Check**, then select the following options:
    * Ping Protocol: TCP.
    * Ping Port: 80.
    * Response Timeout: 2.
    * Interval: 5.
    * Unhealthy Threshold: 2.
    * Healthy Threshold: 2.

1. Click **Next: Add EC2 Instances**, then select the instances that correspond to your public agent nodes.

1. Click **Next: Add Tags** to specify any optional tags for the EC2 classic load balancer.

    You can use the optional tags to find and filter classic load balancer information when needed.

1. Click **Review and Create**, then click **Create**.

## Check the status of the classic load balancer
On the Load Balancer page in the AWS Management Console, you can check the status of the classic load balancer by clicking **Instances**. Depending on the network topology, bandwidth, and latency, it can take time for the new classic load balancer instance to be registered. After your instances are properly registered and displayed in the list of load balancer instances, you can access information about the load balancer by clicking the load balancer name.

## Set up an AWS application or network load balancer
If you deploy DC/OS on an AWS cloud instance, your environment can also include an AWS Application Load Balancer or an AWS Network Load Balancer. 

- The AWS Application Load Balancer (ALB) is a layer-7 load balancer that supports HTTP requests with HTTP connections that terminate as inbound traffic on the Application Load Balancer. 

- The AWS Network Load Balancer is a layer-4 load balancer that distributes TCP traffic with HTTP connections that terminate on the EC2 instance itself, or when used with Edge-LB, directly on the Edge-LB pool load balancer instance.

The steps for configuring an AWS Application Load Balancer (ALB) or AWS Network Load Balancer (NLB) are similar to the steps for creating the classic load balancer and nearly identical to each other.

To configure an application or network load balancer to work with DC/OS:
1. Open the AWS Management Console for your cloud instances.

1. Click **Services**, **Compute**, then **EC2** to navigate to the EC2 Load Balancer configuration page.

1. Under Load Balancing, in the menu on the left, click **Load Balancers**.

1. Click **Create Load Balancer**.

1. Under Application Load Balancer or Network Load Balancer, click **Create**.

1. On the Configure Load Balancer page:
    * Provide a name for the Application Load Balancer or Network Load Balancer.
    * Select **internet-facing** and **ipv4**.
    * Under **Listeners**, specify:
      - **HTTP** and **80** for an Application Load Balancer.
      - **TCP** and **80** for a Network Load Balancer.
    * Select the VPC that your instances are part of.
    * Select the Subnets that your instances are part of.

1. Click **Next: Configure Security Settings** to continue.

1. Click **Next: Configure Security Groups**  to create a security group that allows inbound TCP traffic on port 80 from 0.0.0.0/0.

    Alternatively, you can specify an existing security group that allows inbound traffic on port 80 if you have previously configured an appropriate security group.

1. Click **Next: Configure Routing**, then set the following options:
  * Select **New Target Group**.
  * Specify a **Name** for the new target group.
  * Set the **Protocol** to HTTP for an Application Load Balancer or to TCP for a Network Load Balancer.
  * Set the **Port** to 80.
  * Set the **Target Type** to Instance.
  * Set the **Health Checks Protocol** to HTTP for an Application Load Balancer or to TCP for a Network Load Balancer.
  * Set the **Health Checks Path** to the root directory /.

1. Click **Register Targets**.

1. Select your instances, then click **Add to Registered**.

1. Click **Next: Review** to verify your settings, then click **Create**.

Depending on the network topology, bandwidth, and latency, it can take time for new instances to be registered. After the instances are properly registered, you can access them using the DNS name through your newly-generated load balancer.
