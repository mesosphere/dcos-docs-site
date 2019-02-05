---
layout: layout.pug
title: Deploying DC/OS
navigationTitle: Deploying DC/OS
menuWeight: 10
excerpt: Deploying DC/OS in a production-ready environment
---

# Overview of Production Installation 

The production installation method is used to install production-ready DC/OS that can be upgraded. Using this method, you can package the DC/OS distribution and connect to every node manually to run the DC/OS installation commands. This installation method is recommended if you want to integrate with an existing system or if you do not have SSH access to your cluster. 

The DC/OS installation process requires a bootstrap node, master node, public agent node, and a private agent node. You can view the [nodes](/1.13/overview/concepts/#node) documentation for more information.

The following steps are required to install DC/OS clusters:

*   Configure bootstrap node
*   Install DC/OS on master node
*   Install DC/OS on agent node

![Production Installation Process](/1.13/img/advanced-installer.png)

Figure 1. The production installation process


This installation method requires that:

*   The bootstrap node must be network accessible from the cluster nodes.
*   The bootstrap node must have the HTTP(S) ports open from the cluster nodes.

