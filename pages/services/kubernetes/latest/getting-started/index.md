---
layout: layout.pug
navigationTitle: Getting Started
title: Getting Started with DC/OS Kubernetes
menuWeight: 10
excerpt: Learn how to get up and running using Kubernetes on DC/OS Enterprise
---

# Overview

In this guided tutorial, you will learn many of the basics of using Kubernetes on top of DC/OS Enterprise. Specifically, you will learn the basics of how to:

  - setup DC/OS Kubernetes on a DC/OS Enterprise cluster including:
    * setting up the DC/OS Enterprise cluster to be able to connect securely to the Kubernetes command line (`kubectl`)
    * installing the Mesosphere Kubernetes Engine and CLI to create Kubernetes clusters
    * configuring and securing service accounts for MKE and each Kubernetes cluster to be created
    * configuring DC/OS EdgeLB on top of DC/OS Enterprise to connect to Kubernetes clusters
    * viewing the Kubernetes dashboard via a NGINX web proxy server from outside the secured network perimeter

  - demonstrate key DC/OS Kubernetes features:
    * Autoscaling Kubernetes clusters
    * HD Kubernetes: multiple Kubenetes clusters on a single DC/OS node
    * Kubernetes self healing: nodes automatically rebuild upon failure


<!-- *** note. -->
