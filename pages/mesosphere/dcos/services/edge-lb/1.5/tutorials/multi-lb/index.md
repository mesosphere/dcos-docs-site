---
layout: layout.pug
navigationTitle: Highly-available load balancing on AWS
title: Highly-available load balancing on AWS
menuWeight: 5
excerpt: How to set up multiple load balancer instances for a DC/OS cluster running on AWS
enterprise: true
---

This tutorial demonstrates how to set up multiple Edge-LB load balancer instances in a single pool behind a single Amazon Web Services&reg; (AWS&reg;) Classic Load Balancer. You can perform similar steps to configure Edge-LB load balancers for the AWS Application Load Balancer or the AWS Network Load Balancer&reg;.

In the scenario for this tutorial, you can use multiple Edge-LB pool instances to create a highly-available load balanced environment on a DC/OS&trade; cluster running on a public cloud instance. Using Edge-LB in combination with a public cloud load balancing service like AWS Classic Load Balancer improves network efficiency, application performance, and processing throughput.

# Before you begin

You must have:

* Edge-LB installed as described in the Edge-LB [installation instructions](/mesosphere/dcos/services/edge-lb/1.5/getting-started/installing).
* The core DC/OS command-line interface (CLI) installed and configured to communicate with the DC/OS cluster.
* The `edgelb` command-line interface (CLI) installed.
* An active and properly-configured DC/OS Enterprise cluster, with at least one DC/OS **private agent** node to run the load-balanced service.
* A DC/OS Enterprise cluster with two or more **public agent** nodes running in the virtual private cloud (VPC) of shared computing resources.
* A cloud provider account with sufficient permissions to create and manage AWS load balancers.

If you plan to adapt this tutorial to use Edge-LB with AWS Application Load Balancers or AWS Network Load Balancers, you must have the DC/OS agent nodes configured for multiple AWS availability zones.

# Create the sample app definition

1. Copy and paste the following JSON settings to create the sample app definition for the `customer` service in, and save, the `customer.json` file:

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

1. Start deployment for the `customer.json` app definition:

   ```bash
   dcos marathon app add customer.json
   ```

1. Verify the deployment of the sample service:

    ```bash
    dcos marathon app list
    ```

    This command displays a list of deployed services similar to the following:

    ```bash
        ID                MEM   CPUS  TASKS  HEALTH  DEPLOYMENT  WAITING  CONTAINER  CMD                        
    /customer          32   0.1    0/4    N/A      scale     True       DOCKER   sed -i 's:Welcome to...    
    /dcos-edgelb/api  1024   1     1/1    1/1       ---      False      MESOS    cp -vR /dcosfilestmp/*...  
    /hello-world      1024  0.5    1/1    1/1       ---      False       N/A     export...                  
    /mysql            1024  0.5    0/0    0/0       ---      False      DOCKER   N/A                        
    /openldap         256   0.3    0/0    0/0       ---      False      DOCKER   N/A                        
    ```

# Configure load balancing for the sample service

1. Copy and paste the following JSON settings to create the pool configuration file for the sample service in, and save, the `multi-lb-config.json` file:

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

1. Deploy the Edge-LB configuration:

   ```bash
   dcos edgelb create multi-lb-config.json
   ```

    This command should display confirmation that the pool was successfully created. You can run either of these commands to verify the Edge-LB pool deployment status:
    * dcos edgelb show multi-lb-config
    * dcos edgelb status multi-lb-config

1. Verify the deployment of the sample service:

    ```bash
    dcos marathon app list
    ```

    This command displays a list of deployed services similar to the following:

    ```bash
    ID                                  MEM   CPUS  TASKS  HEALTH  DEPLOYMENT  WAITING  CONTAINER  CMD   
    /customer                            32   0.1    4/4    N/A       ---      False      DOCKER   sed -i 's:Welcome to...    
    /dcos-edgelb/api                    1024   1     1/1    1/1       ---      False      MESOS    cp -vR /dcosfilestmp/*...  
    /dcos-edgelb/pools/multi-lb-config  2048   1     1/1    1/1       ---      False      MESOS    export...
    ```

1. Navigate to the public IP address of each public node to see the deployed Customer Application welcome page.

    You can find the IP address endpoints and port information for the node running the Edge-LB load balancer using the command:

    ```bash
    dcos edgelb endpoints multi-lb-config
    ```

    When DC/OS is deployed on an AWS cloud instance, however, you must find the public-facing IP address provided by Amazon&reg; that is associated with the node to view the sample service. You can then specify that information in the browser to access the sample service through the load balancer. The public-facing IP address provided by Amazon for the node might be a concatenated string similar to `http://luxi-test-publicsl-1jqww865xiuoa-1008229330.us-west-2.elb.amazonaws.com:80`.

    ![Sample service](/mesosphere/dcos/services/edge-lb/1.5/img/customer-sample-app.png)

# Prepare the external load balancer
This tutorial illustrates load balancing for a DC/OS cluster running on an Amazon Web Services (AWS) public or private cloud instance. AWS supports three types of Elastic Load Balancing solutions:
* Application Load Balancers
* Network Load Balancers
* Classic Load Balancers

This tutorial focuses on using Edge-LB with Amazon Web Services (AWS) classic load balancers. The AWS Elastic classic load balancer supports TCP, SSL/TLS, HTTP,  and HTTPS connections for both EC2&reg;-Classic and virtual private cloud (VPC) cluster deployments.

<p class="message--note"><strong>NOTE:  </strong>Edge-LB should not be used with non-HTTP aware load-balancers, as Edge-LB will not be able to recognize the `Connection: close` headers. HAproxy recognizes these headers and closes its end of connection while the L4 load balancer still tries to send requests, and this can cause difficult-to-debug connection timeouts.</p>

## Create a classic load balancer
1. Open the AWS Management Console for your cloud instance.

1. Click **Services**, **Compute**, then **EC2** to navigate to the EC2 Load Balancer configuration page.

1. Under Load Balancing, in the menu on the left, click **Load Balancers**.

1. Click **Create Load Balancer**.

1. Under Classic Load Balancer, click **Create**.

1. On the Define Load Balancer page:
    * Provide a name for your Classic Load Balancer.
    * Select the VPC of which your instances are a part.

1. Specify the following settings under Load Balancer Protocol:
    * Protocol: HTTP
    * Load Balancer Port: 80
    * Instance Protocol: HTTP
    * Instance Port: 80

1. Click the **+** sign next to the subnets of which each of your instances are a part.

    To find details about the VPC and subnets used for your cloud instance, use the AWS Management Console to navigate to Services > Compute > EC2 > **Running Instances**.

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

1. Click **Next: Add Tags** to specify any optional tags for the EC2&reg; classic load balancer.

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
      * **HTTP** and **80** for an Application Load Balancer.
      * **TCP** and **80** for a Network Load Balancer.
    * Select the VPC of which your instances are a part.
    * Select the Subnets of which your instances are a part.

    You can only specify one subnet for each Availability Zone. You must specify a subnet from at least two availability zones to support high-availability load balancing. As a result of this requirement, you must have at least two availability zones and two subnets to configure the Amazon application or network load balancer.

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

1. Click **Register Targets** to select your instances, then click **Add to Registered**.

1. Click **Next: Review** to verify your settings, then click **Create**.

Depending on the network topology, bandwidth, and latency, it can take time for new instances to be registered. After the instances are properly registered, you can access them using the DNS name through your newly-generated load balancer.
