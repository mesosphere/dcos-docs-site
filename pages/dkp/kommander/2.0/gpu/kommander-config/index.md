---
layout: layout.pug
navigationTitle: Kommander configuration
title: Kommander GPU configuration
menuWeight: 20
excerpt: Configure GPU for Kommander clusters
beta: true
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

This topic describes the following procedures for managing your Nvidia platform services:

- [Enable Nvidia platform services](#enable_nvidia_platform_services)

- [Disable Nvidia platform services](#disable_nvidia_platform_services)

- [Upgrade Nvidia platform services](#upgrade_nvidia_platform_services)

- [Nvidia GPU Monitoring](#nvidia_gpu_monitoring)

- [Troubleshooting](#troubleshooting)

## Before you begin

This procedure requires the following items and configurations before you begin:

- Nodes must provide an Nvidia GPU. <!-- with Fermi architecture version 2.1 or greater. FIXME: `nvidia-smi` command below shows Tesla K80, which suggests that this is not true -->

- For AWS select a GPU instance type from the Accelerated Computing section of the [AWS instance types][aws_instance_types].

- Nodes must run CentOS 7.

- You must perform the [Node Deployment](../node-deployment) procedure.

## Enable Nvidia Platform Service on Kommander

To enable Nvidia GPU support on Kommander, perform the following steps:

1. Add the label `konvoy.mesosphere.com/gpu-provider=NVIDIA` to each GPU node with installed Nvidia host components.

   ```bash
   kubectl label node <NODE> konvoy.mesosphere.com/gpu-provider=NVIDIA
   ```

   <p class="message--note"><strong>NOTE: </strong>These placement labels will be applied automatically in later revisions.</p>

1. Enable the `nvidia` services when you install Kommander.

   ```bash
   helm install -n kommander --create-namespace kommander-bootstrap kommander/kommander-bootstrap --set services.nvidia.enabled=true
   ```

## Disable Nvidia Platform Service on Kommander

1. Delete all GPU workloads on the GPU nodes where the Nvidia platform service needs to be upgraded.

1. Delete the existing Nvidia platform service.

1. Wait for all Nvidia-related resources in the `Terminating` state to be cleaned up. You can check pod status with:

   ```bash
   kubectl get pods -A | grep nvidia
   ```

## Upgrade Nvidia Platform Service on Kommander

Kommander can automatically upgrade the Nvidia GPU platform service. However, GPU workload must be drained before the Nvidia platform service can be upgraded.

To upgrade, follow the instructions to disable the service, and then the instructions to enable the service.

<!-- FIXME(tillt): How can we do this on Kommander2? -> check Max's demo for an answer! -->

## Nvidia GPU Monitoring

Kommander uses the [NVIDIA Data Center GPU Manager][nvidia_dcgm] to export GPU metrics towards Prometheus. By default, Kommander has a Grafana dashboard called `NVIDIA DCGM Exporter Dashboard` to monitor GPU metrics. This GPU dashboard is shown in Kommander's Grafana UI.

<!-- FIXME(tillt): How to deploy a specific/later version of this service on Kommander2? -->

## Troubleshooting

1. Determine if all Nvidia pods are in `Running` state, as expected:

   ```bash
   kubectl get pods -A | grep nvidia
   ```

1. Collect the logs for any problematic Nvidia pods, if there are any crashing, returning errors, or flapping. For example:

   ```bash
   kubectl logs -n kube-system nvidia-nvidia-device-plugin-rpdwj
   ```

1. To recover from this problem, you must restart all Nvidia platform service pods that are running on the **SAME** host. In the example below, all Nvidia resources are restarted on the node `ip-10-0-101-65.us-west-2.compute.internal`:

   ```bash
   $ kubectl get pod -A -o wide | grep nvidia
   kommander                           nvidia-nvidia-dcgm-exporter-s26r7                                    1/1     Running     0          51m     192.168.167.174   ip-10-0-101-65.us-west-2.compute.internal    <none>           <none>
   kommander                           nvidia-nvidia-dcgm-exporter-w7lf4                                    1/1     Running     0          51m     192.168.111.173   ip-10-0-75-212.us-west-2.compute.internal    <none>           <none>
   kube-system                         nvidia-nvidia-device-plugin-rpdwj                                    1/1     Running     0          51m     192.168.167.175   ip-10-0-101-65.us-west-2.compute.internal    <none>           <none>
   kube-system                         nvidia-nvidia-device-plugin-z7m2s                                    1/1     Running     0          51m     192.168.111.172   ip-10-0-75-212.us-west-2.compute.internal    <none>           <none>
   $ kubectl delete pod -n kommander nvidia-nvidia-dcgm-exporter-s26r7
   pod "nvidia-nvidia-dcgm-exporter-s26r7" deleted
   $ kubectl delete pod -n kube-system nvidia-nvidia-device-plugin-rpdwj
   pod "nvidia-nvidia-device-plugin-rpdwj" deleted
   ```

1. To collect more debug information on the Nvidia platform service, run:

   ```bash
   helm get all nvidia -n kommander
   ```

1. To validate metrics being produced and exported by the Nvidia DCGM exporter on a GPU node:

   ```bash
   kubectl exec -n kommander nvidia-nvidia-dcgm-exporter-s26r7 --tty -- wget -nv -O- localhost:9400/metrics
   ```

[nvidia_dcgm]: https://developer.nvidia.com/dcgm
[aws_instance_types]: https://aws.amazon.com/ec2/instance-types/
