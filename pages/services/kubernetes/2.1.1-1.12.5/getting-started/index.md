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

    * setting up the DC/OS Enterprise cluster to be able to connect to the Kubernetes command line (`kubectl`)
    * configuring and securing service accounts for MKE and each Kubernetes cluster to be created
    * installing the Mesosphere Kubernetes Engine and CLI to create Kubernetes clusters
    * configuring DC/OS Edge-LB on top of DC/OS Enterprise to connect to multiple Kubernetes clusters' api servers
    * deploying an Nginx deployment on your new cluster
    * viewing the Kubernetes dashboard

<p class="message-important"><strong>IMPORTANT: </strong>This tutorial assumes you have access to a production DC/OS Enterprise cluster.</p>

## First Section: Installing and Using Kubernetes on DC/OS

In the [first part of the tutorial](/services/kubernetes/2.1.1-1.12.5/getting-started/setting-up/), you will set up your cluster for a successful installation of DC/OS Kubernetes.
