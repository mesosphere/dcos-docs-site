---
layout: layout.pug
excerpt: Part 6 - Exposing Apps Publicly
title: Tutorial -  Exposing Apps Publicly
navigationTitle: Exposing Apps Publicly
menuWeight: 6
---


<table class=“table” bgcolor=#858585>
<tr> 
  <td align=justify style=color:white><strong>Important:</strong> Mesosphere does not support this tutorial, associated scripts, or commands, which are provided without warranty of any kind. The purpose of this tutorial is purely to demonstrate capabilities, and it may not be suited for use in a production environment. Before using a similar solution in your environment, you should adapt, validate, and test.</td> 
</tr> 
</table>

Welcome to part 6 of the DC/OS 101 Tutorial.


# Prerequisites
* A [running DC/OS cluster](/1.11/tutorials/dcos-101/cli/) with [the DC/OS CLI installed](/1.11/tutorials/dcos-101/cli/).
* [app2](/1.11/tutorials/dcos-101/app2/) deployed and running in your cluster.


# Objective
In this section you will make app2 available from outside the cluster by running it on a public agent node with Marathon-LB.

# Steps
DC/OS has two different node types:

1. Private agent nodes
1. Public agent nodes

Private agent nodes are usually only accessible inside the cluster, while public agent nodes allow for ingress access from outside the cluster.

By default, Marathon starts applications and services on private agent nodes, which cannot be accessed from the outside the cluster. To expose an app to the outside you usually use a load balancer running on one of the public nodes.

You will revisit the topic of load balancing and the different choices for load balancers later in this tutorial, but for now, you will use [Marathon-LB](/1.11/tutorials/dcos-101/loadbalancing/) as the load balancer. Marathon-LB uses [HA-Proxy](http://www.haproxy.org/) on a public agent node to provide external access and load balancing for applications running internally in the cluster.

  * Install Marathon-LB: `dcos package install marathon-lb`
  * Check that it is running using `dcos task` and identify the IP address of the public agent node (Host) where Marathon-LB is running
    * WARNING: If you started your cluster using a cloud provider ( especially AWS ) `dcos task` might show you the private IP address of the host, which is not resolvable from outside the cluster. If the marathon-lb task has an [RFC1918](https://en.wikipedia.org/wiki/Private_network) address beginning with 192.168 or 10 then this is the private IP address.

      In that case, you need to retrieve the public IP from your cloud provider. For AWS, go to the EC2 dashboard and search using the search box for the private IP assigned to the marathon-lb task shown by `dcos task`. The public IP will be listed in the IPv4 Public IP field for the returned instance.

  * Connect to the webapp (from your local machine) via `<Public IP>:10000`. You should see a rendered version of the web page including the physical node and port app2 is running on.
  * Use the web form to add a new Key:Value pair
  * You can verify the new key was added in two ways:
    1. Check the total number of keys using app1: `dcos task log app1`
    2. Check redis directly
       *  [SSH](/1.11/administering-clusters/sshcluster/) into node where redis is running:

           ```bash
           dcos node ssh --master-proxy --mesos-id=$(dcos task  redis --json |  jq -r '.[] | .slave_id')
           ```
       * Because Redis is running in a Docker container you can list all the Docker containers using `docker ps` and get the ContainerID of the redis task.
       * Create a bash session in the running container using the ContainerID from the previous step: `sudo docker exec -i -t CONTAINER_ID  /bin/bash`.
       * Start the Redis CLI: `redis-cli`.
       * Check the value is there: `get <newkey>`.

# Outcome
Congratulations! You have used Marathon-LB to expose your application to the public and added a new key to Redis using the web frontend.
