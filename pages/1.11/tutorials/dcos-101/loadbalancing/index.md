---
layout: layout.pug
navigationTitle:  Load-Balancing
excerpt: Part 8 - Load-Balancing
title: Tutorial - Load-Balancing
menuWeight: 8
---


<table class=“table” bgcolor=#858585>
<tr> 
  <td align=justify style=color:white><strong>Important:</strong> Mesosphere does not support this tutorial, associated scripts, or commands, which are provided without warranty of any kind. The purpose of this tutorial is purely to demonstrate capabilities, and it may not be suited for use in a production environment. Before using a similar solution in your environment, you should adapt, validate, and test.</td> 
</tr> 
</table>
Welcome to part 8 of the DC/OS 101 Tutorial.


# Prerequisites
* A [running DC/OS cluster](/1.11/tutorials/dcos-101/cli/) with [the DC/OS CLI installed](/1.11/cli/install/).
* [app2 and Marathon-LB](/1.11/tutorials/dcos-101/app2/) deployed and running in your cluster.

# Objective
In this session, you will scale your application to multiple instances and learn how internal and external services choose which instance to use once the application has been scaled.

# Steps
Load-balancers decide which instance of an app internal or external services should use. With DC/OS, you have two different built-in load-balancer options:

1. [Marathon-LB](/1.11/networking/marathon-lb/)
1. [Named VIPs](/1.11/networking/load-balancing-vips/).

You have already explored these load balancing mechanisms in the context of [service discovery](/1.11/tutorials/dcos-101/service-discovery/), and in a [previous](/1.11/tutorials/dcos-101/marathon-lb/) tutorial you used Marathon-LB to publicly expose app2. Now let's explore them a bit more.
* First, scale app2 to two instances:

  `dcos marathon app update /dcos-101/app2 instances=2`
* **Marathon-LB**
    * Check app2 as before via `http://<public-node>10000`. When you do this repeatedly you should see the request being served by different instances of app2.
    * You can also check the Marathon-LB stats via `http://<public-node>:9090/haproxy?stats`
* **Named VIPs**
    * SSH to the leading master node: `dcos node ssh --master-proxy --leader`
    * Use curl to get the raw HTML output from the app:

      `curl dcos-101app2.marathon.l4lb.thisdcos.directory:10000`

      When you do this repeatedly you should see the request being served by different instances.
* Scale app2 back to one instance:

  `dcos marathon app update /dcos-101/app2 instances=1`

# Outcome
You used Marathon-LB and VIPs to load balance requests for two different instances of your app.

# Deep Dive
Consider these features and benefits when choosing the load balancing mechanism.

   * [Marathon-LB](/1.11/networking/marathon-lb/) is a layer 7 load balancer that is mostly used for external requests. It is based on the well-known HAProxy load balancer and uses Marathon’s event bus to update its configuration in real time. Being a layer 7 load balancer, it supports session-based features such as HTTP sticky sessions and zero-downtime deployments.
   * [Named VIPs](/1.11/networking/load-balancing-vips/) are a layer 4 load balancer mechanism used for internal TCP traffic. As they are tightly integrated with the kernel, they provide a load balanced IP address which can be used from anywhere within the cluster.
