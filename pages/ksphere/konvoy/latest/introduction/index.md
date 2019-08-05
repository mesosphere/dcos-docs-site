---
layout: layout.pug
title: Introducing Konvoy
navigationTitle: Introducing Konvoy
excerpt: Deploy production-ready Kubernetes with Konvoy
menuWeight: 1
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

Konvoy is a complete, standalone distribution of Kubernetes that includes a native Kubernetes cluster pre-packaged for deployment with a complement of best-in-class add-on services enabled by default and ready for immediate use.
By combining the native Kubernetes cluster with all of the components required for operation and lifecycle management, Konvoy provides an out-of-the-box and production-ready Kubernetes ecosystem that you can install using a single command-line instruction.

Because Konvoy packages all of its components as a fully integrated and tested solution with complete technical support, Konvoy enables organization to easily provision Kubernetes clusters into a production environment.
Its suite of pre-selected [Cloud Native Computing Foundation (CNCF)](https://www.cncf.io) and community-contributed tools provide important additional functionality that is key to managing both cluster operations and the applications deployed on the cluster.

## Features and functionalities

Konvoy provides the following features and functionalities:

- Simplified installation

    Use a simple, single command to install CNCF-certified,high-availability Kubernetes on a public cloud (currently AWS with other cloud providers supported in future releases) or an internal on-prem network.

- Infrastructure provisioning

    Provision the cluster infrastructure on cloud provider using Terraform (currently AWS) or pre-deploy a physical or virtual infrastructure, then deploy using Konvoy.

- Core addons for networking and storage production-readiness

    Install and enable a default set of core addons to provide the most common features required to run the Kubernetes cluster in production, including the following:

  - Calico (Network overlay)
  - Traefik (Ingress provider)
  - Local storage class (default)

- Core addons for collecting metrics and logging

    Install and enable a default set of core addons for monitoring, metrics, and logging, including the following:

  - Monitoring and metrics using Prometheus, AlertManager, Grafana, and Telegraf
  - Logging using Fluent Bit, Elasticsearch, and Kibana

- Operational infrastructure addons

    Install and enable a default set of addons for backup and restore using open source tools (CNCF stack) and to configure the cluster with best practices for security and operations.

- Operational dashboards

    Access web-based dashboards for the Kubernetes cluster and addons from a single entry point.

- Lifecycle management

    Enable basic lifecycle management including scaling, patching, and upgrading for deployed applications and services.

## Benefits

Konvoy offers the following key benefits:

- It provides a simple and flexible platform to build applications.
- It eliminates the need to use of multiple commands to spin up a cluster.
- It simplifies the deployment and cluster configuration process by using a single file and a single command to install, enable, and customize cluster components.
- It delivers an end-to-end solution with CNCF technologies.
- It reduces the time, expertise, cost, and resources required to build and deploy on multiple infrastructures.
