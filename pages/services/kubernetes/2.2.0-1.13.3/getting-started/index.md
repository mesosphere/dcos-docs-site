---
layout: layout.pug
navigationTitle: Tutorial - Kubernetes on DC/OS Enterprise
title: Tutorial - Setting Up Kubernetes on DC/OS Enterprise
menuWeight: 40
excerpt: Learn how to get up and running using Kubernetes on DC/OS Enterprise
enterprise: true
---

## Learning Objectives

In this guided tutorial, you will learn many of the basics of using Kubernetes on top of DC/OS Enterprise. Specifically, you will be:

1. [Setting up](/services/kubernetes/2.2.0-1.13.3/getting-started/setting-up/) the DC/OS Enterprise cluster to be able to connect to the Kubernetes command line (`kubectl`)
1. [Configuring and securing service accounts](/services/kubernetes/2.2.0-1.13.3/getting-started/creating-clusters/) for MKE and each Kubernetes cluster to be created
1. [Installing](/services/kubernetes/2.2.0-1.13.3/getting-started/installing-mke/) the Mesosphere Kubernetes Engine and CLI to create Kubernetes clusters
1. [Configuring DC/OS Edge-LB](/services/kubernetes/2.2.0-1.13.3/getting-started/config-edgelb-for-k8s/) on top of DC/OS Enterprise to connect to multiple Kubernetes clusters' API servers
1. [Deploying an Nginx deployment](/services/kubernetes/2.2.0-1.13.3/getting-started/test-connect/) on your new cluster and viewing the Kubernetes dashboard

<p class="message--important"><strong>IMPORTANT: </strong>This tutorial assumes you have access to a production DC/OS Enterprise cluster.</p>

**First Section: Installing and Using Kubernetes on DC/OS**

In the [first part of the tutorial](/services/kubernetes/2.2.0-1.13.3/getting-started/setting-up/), you will set up your cluster for a successful installation of DC/OS Kubernetes.
