---
layout: layout.pug
navigationTitle: Install Kommander air gapped
title: Install Kommander air gapped
menuWeight: 5
excerpt: Install Kommander in an air gapped environment
beta: true
enterprise: false
draft: true
---

<!-- markdownlint-disable MD018 MD025 MD007 MD030 MD032-->
This section documents how to install Kommander in an air gapped environment, using the air gapped Konvoy installation documentation as the foundation. The following process details how to run Kommander on top of an air gapped Konvoy cluster.

## Naming

This document uses the following terms:
- Management cluster - Konvoy cluster running Kommander
- Attached cluster - Konvoy or non-Konvoy cluster attached to the management cluster
- Docker registry - a registry containing all Docker images that clusters access and download during installation

## Prerequisites

Before you begin, you must:

- Have a Docker registry containing all the necessary Docker installation images, which also includes the Kommander images. The `konvoy_air_gapped.tar.bz2` tarball has the required artifacts.

- Have connectivity with clusters attaching to the management cluster:
  - Both management and attached clusters must connect to the Docker registry.
  - Management cluster must connect to the attached cluster's API server.
  - Management cluster must connect to load balancers created by some platform services. For example, Thanos, part of the Prometheus platform service, connects to those load balancers.

- Have completed all the prerequisites covered in [air-gapped Konvoy installation][air-gap-before-you-begin], in case of Konvoy clusters.

## Control plane nodes

Control plane nodes of Konvoy clusters should meet the minimal requirements outlined in [air gapped Konvoy installation][air-gap-control-plane].

## Worker nodes

Worker nodes must meet the minimal requirements outlined in [air gapped Konvoy installation][air-gap-worker-nodes].

## Operating system and services for all nodes

All nodes must meet the same minimal requirements outlined in [air gapped Konvoy installation][air-gap-os-system].

[air-gap-before-you-begin]: /dkp/konvoy/2.0/install/air-gapped/prerequisites/
[air-gap-control-plane]: /dkp/konvoy/2.0/install/air-gapped/new/
[air-gap-os-system]: /dkp/konvoy/2.0/install/air-gapped/prerequisites/
