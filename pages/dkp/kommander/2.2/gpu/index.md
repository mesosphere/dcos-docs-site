---
layout: layout.pug
navigationTitle: GPUs
title: GPUs
menuWeight: 150
excerpt: Configure GPU for Kommander cluster
beta: false
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

This section describes Nvidia GPU support on Kommander. DKP supported Nvidia driver versions are 450.x and 460.x. Other GPUs, such as those made by AMD, are not currently supported. This document assumes familiarity with Kubernetes GPU support. More information about GPUs in AWS environment can be found in the [Advanced AWS](../../../konvoy/2.2/choose-infrastructure/aws/gpu/) section.

# Kommander GPU Overview

GPU support on Kommander uses the [Nvidia container runtime][nvidia_container_runtime].
With the Nvidia GPU turned on, Kommander configures the container runtime to run GPU containers, and installs all the necessary items to power up the Nvidia GPU devices.

The following components provide Nvidia GPU support on Kommander:

- [`libnvidia-container`][libnvidia_container] and [`nvidia-container-runtime`][nvidia_container_runtime]: GPU Support in Kommander depends on the containerd runtime. `libnvidia-container` and `nvidia-container-runtime` fit between `containerd` and `runc`, simplifying the container runtime integration with the GPU.
- [Nvidia Device Plugin][nvidia_k8s_device_plugin]: Kommander makes use of Nvidia GPUs using this Kubernetes device plugin. It allows GPU enabled containers to run on Kubernetes, tracking the number of available GPUs on each node and their health.
- [Nvidia Data Center GPU Manager][nvidia_dcgm]: Contains a Prometheus exporter that provides Nvidia GPU metrics.

Kommander runs these components as daemonsets, making them easier to manage and upgrade across all GPU nodes.

The following procedures are described:

- [Node deployment](./node-deployment)

- [Kommander configuration](./kommander-config)

[libnvidia_container]: https://github.com/NVIDIA/libnvidia-container
[nvidia_container_runtime]: https://github.com/NVIDIA/nvidia-container-runtime
[nvidia_k8s_device_plugin]: https://github.com/NVIDIA/k8s-device-plugin
[nvidia_dcgm]: https://developer.nvidia.com/dcgm
