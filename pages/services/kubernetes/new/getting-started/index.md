---
layout: layout.pug
navigationTitle: Getting Started
title: Getting Started with DC/OS Kubernetes
menuWeight: 10
excerpt: Learn how to get up and running using Kubernetes on DC/OS Enterprise
---

<h1>Learning Objectives</h1>

In this guided tutorial, you will learn many of the basics of using Kubernetes on top of DC/OS Enterprise. Specifically, you will learn the basics of how to:

  - **setup DC/OS Kubernetes on a DC/OS Enterprise cluster** including:

    * setting up the DC/OS Enterprise cluster to be able to connect securely to the Kubernetes command line (`kubectl`)
    * installing the Mesosphere Kubernetes Engine and CLI to create Kubernetes clusters
    * configuring and securing service accounts for MKE and each Kubernetes cluster to be created
    * configuring DC/OS EdgeLB on top of DC/OS Enterprise to connect to Kubernetes clusters via the Kubernetes Dashboard
    * viewing the Kubernetes dashboard via a NGINX web proxy server from outside the secured network perimeter

  - **demonstrate value-adding features of running Kubernetes on DC/OS Enterprise**:

    * HD Kubernetes: multiple Kubenetes clusters on a single DC/OS node
    * Autoscaling Kubernetes clusters: just reconfigure and watch them scale
    * Kubernetes self healing: nodes automatically rebuild upon failure

# Next: [Installing and Using Kubernetes on DC/OS](services/kubernetes/new/getting-started/provision-install/)

In this [first part of the the tutorial](services/kubernetes/new/getting-started/provision-install/), you will setup your cluster for the a successful installation of DC/OS Kubernetes, install the Mesosphere Kubernetes Engine (MKE), and finally create a pair of HD Kubernetes clusters using the DC/OS Kubernetes CLI.

Below, you can jump to any section by clicking on the card or [click here to go to the first part](services/kubernetes/new/getting-started/provision-install/) of[**Getting Started with Kubernetes on DC/OS Enterprise**](top).

<!-- *** note. -->
