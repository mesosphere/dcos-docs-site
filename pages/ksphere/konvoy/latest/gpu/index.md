---
layout: layout.pug
navigationTitle: GPU
title: GPU
menuWeight: 8
excerpt: Configure GPU for Konvoy cluster
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

This section describes the Nvidia GPU support on Konvoy. This document assumes familiarity with Kubernetes GPU support. The AMD GPU is currently not supported.

# Konvoy GPU Overview

GPU support on Konvoy is achieved by using the [nvidia-container-runtime][nvidia_container_runtime] and [Nvidia Driver Container][nvidia_driver_container].
With the Nvidia GPU turned on, Konvoy configures the container runtime, for running GPU containers, and installs all the necessary items to power up the Nvidia GPU devices.
Konvoy runs every Nvidia GPU dependent component as daemonsets, making it easier to manage and upgrade.

<p class="message--note"><strong>NOTE: </strong> Konvoy assumes there are no legacy GPU drivers or device plugins running on the host machine. Legacy GPU drivers and plugins can conflict with the Konvoy deployed drivers and plugins. </p>

The following components provide Nvidia GPU support on Konvoy:

* [libnvidia-container][libnvidia_container] and [nvidia-container-runtime][nvidia_container_runtime]: Konvoy uses containerd as kubernetes container runtime by default. [libnvidia-container][libnvidia_container] and [nvidia-container-runtime][nvidia_container_runtime] shim between containerd and runc, which simplifies the container runtime integration with GPU support. Another benefit is this avoids using [nvidia-docker2][nvidia_docker].
* [Nvidia Driver Container][nvidia_driver_container]: Allows running Nvidia driver inside of a container making it easier to deploy, faster to install, and reproducible.
* [Nvidia Device Plugin][nvidia_device_plugin]: This plugin displays the number of GPUs on each node, tracks the health of the GPUs, and enables running GPU enabled containers on Kubernetes.
* [Nvidia GPU Metrics Exporter][nvidia_gpu_metrics_exporter] and [NVIDIA Data Center GPU Manager][nvidia_dcgm]: This is a Prometheus exporter that displays Nvidia GPU metrics.

## Requirements

1. Ubuntu 16.04, or Centos 7 with the IPMI driver enabled and the Nouveau driver disabled.

<!-- If you are running Ubuntu 18.04 with an AWS kernal, you also need to enable the i2c_core kernel module. -->

1. NVIDIA GPU with Fermie architecture version 2.1 or greater.

1. Ensure the kernel-headers version is identical to the kernel version on each node. To verify this use the following script:

* Centos

```bash
KERNEL_VERSION=$(uname -r) && yum -q list available --show-duplicates kernel-headers | awk -v arch=$(uname -m) 'NR>1 {print $2"."arch}' | tac | grep -E -m1 "^${KERNEL_VERSION/latest/.*}"
```

* Ubuntu

```bash
KERNEL_VERSION=$(uname -r) && apt-cache show "linux-headers-${KERNEL_VERSION}" 2> /dev/null | sed -nE 's/^Version:\s+(([0-9]+\.){2}[0-9]+)[-.]([0-9]+).*/\1-\3/p' | head -1
```

## Configuration

### Enable Nvidia GPU on Konvoy

To enable Nvidia GPU support on Konvoy, add the Nvidia GPU `nodePools` in ClusterProvisioner and ClusterConfiguration, then enable the `nvidia` addon. Here is an example of the `cluster.yaml`:

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta1
......
spec:
  provider: aws
......
  nodePools:
  - name: gpu-worker
    count: 4
    machine:
      rootVolumeSize: 80
      rootVolumeType: gp2
      imagefsVolumeEnabled: true
      imagefsVolumeSize: 160
      imagefsVolumeType: gp2
      imagefsVolumeDevice: xvdb
      type: p2.xlarge
......
---
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta1
......
spec:
......
  nodePools:
  - name: gpu-worker
    gpu:
      nvidia:
        enabled: true
  addons:
  - configRepository: https://github.com/mesosphere/kubernetes-base-addons
    configVersion: v1.3.0
    addonsList:
......
    - name: nvidia
      enabled: true
......
```

### Konvoy GPU Support on Ubuntu

By default, Konvoy assumes the cluster OS is CentOS. If you want to run the GPU workloads on Ubuntu, you must update the [Nvidia Driver Container][nvidia_driver_container] image in the `cluster.yaml`:

```yaml
......
---
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta1
......
spec:
......
  addons:
  - configRepository: https://github.com/mesosphere/kubernetes-base-addons
    configVersion: stable-1.16.4-2
    addonsList:
......
    - name: nvidia
      enabled: true
      values: |
      nvidia-driver:
        enabled: true
        image:
          tag: "418.87.01-ubuntu16.04"
......
```

See [Nvidia Public Hub Repository][nvidia_plublic_hub_repository] for available driver container images.

### How to prevent other workloads from running on GPU nodes

Use Kubernetes taints to ensure only dedicated workloads are deployed on GPU machines. You must add tolerations to your GPU workloads to deploy on the dedicated GPU nodes. See [Kubernetes Taints and Tolerations][k8s_taints_and_tolerations] for details. Here is an example of `cluster.yaml`:

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta1
......
spec:
......
  nodePools:
  - name: gpu-worker
    count: 4
    machine:
      rootVolumeSize: 80
      rootVolumeType: gp2
      imagefsVolumeEnabled: true
      imagefsVolumeSize: 160
      imagefsVolumeType: gp2
      imagefsVolumeDevice: xvdb
      type: p2.xlarge
......
---
kind: ClusterConfiguration
......
spec:
......
  nodePools:
  - name: gpu-worker
    gpu:
      nvidia:
        enabled: true
    labels:
      - key: dedicated
        value: gpu-worker
    taints:
      - key: dedicated
        value: gpu-worker
        effect: NoExecute
  addons:
  - configRepository: https://github.com/mesosphere/kubernetes-base-addons
    configVersion: v1.3.0
    addonsList:
......
    - name: nvidia
      enabled: true
      values: |
        nvidia-driver:
          tolerations:
            - key: "dedicated"
              operator: "Equal"
              value: "gpu-worker"
              effect: "NoExecute"
        nvidia-device-plugin:
          tolerations:
            - key: "dedicated"
              operator: "Equal"
              value: "gpu-worker"
              effect: "NoExecute"
        nvidia-dcgm-exporter:
          tolerations:
            - key: "dedicated"
              operator: "Equal"
              value: "gpu-worker"
              effect: "NoExecute"
......
```

## Nvidia GPU Monitoring

Konvoy uses [Nvidia GPU Metrics Exporter][nvidia_gpu_metrics_exporter] and [NVIDIA Data Center GPU Manager][nvidia_dcgm] to display Nvidia GPU metrics. By default, Konvoy has a grafana dashboard called `GPU/Nvidia` to monitor GPU metrics. This GPU dashboard in Konvoy's Grafana UI.

## Debugging

1. Determine if all Nvidia pods are in `Running` state, as expected:

```bash
kubectl get pod -A | grep nvidia
```

1. If there are any Nvidia pods crashing, returning errors, or flapping, collect the logs for the problematic pod. For example:

```bash
kubectl logs -n kube-system nvidia-kubeaddons-nvidia-driver-bbkwg
```

1. To recover from this problem, you must restart all Nvidia-addon pods that are running on the **SAME** host. This is because both `nvidia-dcgm-exporter` and `nvidia-device-plugin` are dependent on `nvidia-driver`.

1. To collect more debug information on the Nvidia-addon, run:

```bash
helm get nvidia-kubeaddons
```

[libnvidia_container]: https://github.com/NVIDIA/libnvidia-container
[nvidia_container_runtime]: https://github.com/NVIDIA/nvidia-container-runtime
[nvidia_docker]: https://github.com/NVIDIA/nvidia-docker
[nvidia_driver_container]: https://github.com/NVIDIA/nvidia-docker/wiki/Driver-containers-(Beta)
[nvidia_plublic_hub_repository]: https://hub.docker.com/r/nvidia/driver
[nvidia_k8s_device_plugin]: https://github.com/NVIDIA/k8s-device-plugin
[nvidia_dcgm]: https://developer.nvidia.com/dcgm
[nvidia_gpu_metrics_exporter]: https://github.com/NVIDIA/gpu-monitoring-tools
[k8s_taints_and_tolerations]: https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/
