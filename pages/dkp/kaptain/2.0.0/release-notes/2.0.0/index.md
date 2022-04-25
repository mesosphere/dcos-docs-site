---
layout: layout.pug
navigationTitle: Release Notes for Kaptain 2.0.0
title: Release Notes for Kaptain 2.0.0
menuWeight: 5
beta: false
excerpt: View release-specific information for Kaptain
---

**D2iQ&reg; Kaptain&reg; version 2.0.0 was released on April 25, 2022.**

To get started with Kaptain, [download](../../download) and [install](../../install) the latest version of Kaptain.

# Release Summary

This release provides new features and capabilities that improve user experience, resolves reported issues, and changes the way Kaptain is deployed. This release supports Kubeflow 1.5 and a new version of the Kaptain SDK, 1.0.1. For more information on SDK 1.0.1, see [SDK release notes](../../sdk/1.0.x/release-notes).

## New features and capabilities

### Added Kaptain as DKP Catalog application

Starting with Kaptain 2.0, it can be easily installed via the DKP catalog. [something something something]. Kaptain 2.0 is supported on DKP 2.1.2 onwards.

### Extended Support for Amazon EKS, Azure EKS and DKP multi-cluster

Kaptain 2.0 is now validated (verified?) to be deployed on attached clusters running on Amazon EKS and Azure AKS. 

### Helm based deployment

Kaptain 2.0 now uses helm based deployment which makes it easier to integrate into DKP and other platforms.

### Support for Kubernetes 1.22 and Kubeflow 1.5

Kaptain 2.0 now comes with Kubeflow 1.5 and supports Kubernetes 1.22

### Bundle size reduction

Kaptain 2.0 drastically reduces the bundle sizes improving download times, especially for the CPU and GPU bundle:

- Base installation: 31.8 GB (down from 33.2 GB)
- CPU bundle: 12.4 GB (down from 34.3 GB)
- GPU bundle: 17.2 GB (down from 84.7 GB)

## Fixes and Improvements

- Moved from KFServing to KServe

## Software updates

- Kubeflow 1.5.0
- Argo Workflows 3.2.3
- Katib 0.13.0
- KServe 0.7.0
- Percona Kubernetes Operator 1.10.0
- Kubeflow Pipelines 1.8.1
- Training Operator 1.4.0
- Tensorflow 2.8.0
- Pytorch 1.11.0
- CUDA 11.4
- MXNet 1.9
- Horovod 0.24.2
