---
layout: layout.pug
navigationTitle:  Release Notes for Kaptain 1.2.0-1.1.0
title: Release Notes for Kaptain 1.2.0-1.1.0
menuWeight: 5
beta: false
excerpt: View release-specific information for Kaptain
---

# Release Notes

## 1.2.0-1.1.0 - Released 12 May 2021

This document describes the new features, caveats, and resolved issues in D2iQ Kaptain.

### New features

* Full live upgradability of Kaptain and all of its configurations without interruption of user workloads
* Highly-available and scalable MinIO operator for in-cluster Pipelines data storage
* Consolidated highly-available and scalable MySQL cluster for Katib, Metadata, and Pipelines
* S3 Backup/Restore for the MySQL cluster
* Kaptain SDK support for private Docker registries with custom certificates

### Improvements

* Konvoy 1.8 support
* Kubernetes 1.20 support
* Istio 1.9 support

### Software updates

* CUDA 11.0
* MXNet 1.8.0

### Deprecations

* Custom Docker images with Tensorflow versions 1.x removed from the distribution. The default Tensorflow version included with the Kaptain Docker images is 2.4.0
