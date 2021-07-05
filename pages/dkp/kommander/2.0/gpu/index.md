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

This section describes the Nvidia GPU support on Kommander. This document assumes familiarity with Kubernetes GPU support. AMD GPUs are currently not supported.

# Kommander GPU Overview

GPU support on Kommander is achieved by using the [nvidia-container-runtime][nvidia_container_runtime].
With the Nvidia GPU turned on, Kommander configures the container runtime for running GPU containers, and installs all the necessary items to power up the Nvidia GPU devices.
Kommander runs every Nvidia GPU dependent component as daemonsets, making it easier to manage and upgrade.

The following components provide Nvidia GPU support on Kommander:

* [libnvidia-container][libnvidia_container] and [nvidia-container-runtime][nvidia_container_runtime]: Konvoy uses containerd as Kubernetes container runtime by default. [libnvidia-container][libnvidia_container] and [nvidia-container-runtime][nvidia_container_runtime] shim between containerd and runc, which simplifies the container runtime integration with GPU support.
* [Nvidia Device Plugin][nvidia_k8s_device_plugin]: Konvoy makes use of Nvidia GPUs via this Kubernetes device plugin. It enables running GPU enabled containers on Kubernetes, tracks the number of available GPUs on each node and their health.
* [Nvidia Data Center GPU Manager][nvidia_dcgm]: Contains a Prometheus exporter that provides Nvidia GPU metrics.


## Requirements

1.  FIXME(tillt): <INSERT SUPPORTED DISTROS FOR PHASE 1> with the IPMI driver enabled and the Nouveau driver disabled.

1.  Nvidia GPU with Fermie architecture version 2.1 or greater.

1.  Nvidia driver must be running on each GPU host node. Nvidia driver version `460.73.01` is recommended. FIXME(tillt):<LINK TO KONVOY-IMAGE-BUILDER DOCUMENTATION: nvidia> <LINK TO ON-PREM INSTALLATION: overview>

* Verify the Nvidia driver is running on the host

```bash
$ nvidia-smi
Fri Jun 11 09:05:31 2021
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 460.73.01    Driver Version: 460.73.01    CUDA Version: 11.2     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                               |                      |               MIG M. |
|===============================+======================+======================|
|   0  Tesla K80           Off  | 00000000:00:1E.0 Off |                    0 |
| N/A   35C    P0    73W / 149W |      0MiB / 11441MiB |     99%      Default |
|                               |                      |                  N/A |
+-------------------------------+----------------------+----------------------+

+-----------------------------------------------------------------------------+
| Processes:                                                                  |
|  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
|        ID   ID                                                   Usage      |
|=============================================================================|
|  No running processes found                                                 |
+-----------------------------------------------------------------------------+
```

## Configuration

FIXME(tillt): <LINK TO KONVOY2 CLUSTER.YAML DOCUMENTATION>
FIXME(tillt): The following is misplaced here - it is Konvoy 2.0 documentation.

### Enable Nvidia GPU on Konvoy

For provisioning a GPU node via Konvoy 2 on AWS, edit the generated cluster configuration YAML. Update the `instanceType` of the worker nodepool towards something that has Nvidia GPUs - i.e.: `p2.xlarge`. Then reference your konvoy-image-builder generated AMI in that configuration as well. In this simplified example, we use AMI ID `ami-0d931a15fdf46f14f` resolving to an AMI named `konvoy-ami-centos-7-nvidia-1.20.6-1624884981` on AWS region `us-west-2`.

```yaml
[...]
---
apiVersion: infrastructure.cluster.x-k8s.io/v1alpha3
kind: AWSMachineTemplate
metadata:
  [...]
  name: till-aws-cluster-md-0
  [...]
spec:
  template:
    spec:
      [...]
      instanceType: p2.xlarge
      [...]
      ami:
        id: ami-0d931a15fdf46f14f
```

### Enable Nvidia GPU on Kommander

To enable Nvidia GPU support on Kommander the first thing to do is adding the label `konvoy.mesosphere.com/gpu-provider=NVIDIA` to each GPU node with installed Nvidia host components.

```bash
kubectl label nodes <NODE> konvoy.mesosphere.com/gpu-provider=NVIDIA
```

Then when installing Kommander, enable the `nvidia` services. 

```bash
helm install -n kommander --create-namespace kommander-bootstrap kommander/kommander-bootstrap --set services.nvidia.enabled=true
```

## Nvidia GPU Monitoring

Kommander uses the [NVIDIA Data Center GPU Manager][nvidia_dcgm] to export GPU metrics towards Prometheus. By default, Konvoy has a Grafana dashboard called `NVIDIA DCGM Exporter Dashboard` to monitor GPU metrics. This GPU dashboard is shown in Konvoy's Grafana UI.

## Upgrade

Kommander is capable of automatically upgrading the Nvidia GPU platform service. However, GPU workload needs to be drained if the Nvidia platform service is being upgraded.

1.  Delete all GPU workloads on the GPU nodes where the Nvidia platform service needs to be upgraded.

1.  Delete the existing Nvidia platform service:

FIXME(tillt): How can we do this on Kommander2? -> check Max's demo for an answer!

1. Wait for all Nvidia-related resources in the `Terminating` state to be cleaned up. You can check pod status with:

    ```bash
    kubectl get pods -A | grep nvidia
    ```

FIXME(tillt): How to deploy a specific/later version of this service on Kommander2?

## Debugging

1.  Determine if all Nvidia pods are in `Running` state, as expected:

    ```bash
    kubectl get pods -A | grep nvidia
    ```

1.  If there are any Nvidia pods crashing, returning errors, or flapping, collect the logs for the problematic pod. For example:

    ```bash
    kubectl logs -n kube-system nvidia-nvidia-device-plugin-rpdwj
    ```

1.  To recover from this problem, you must restart all Nvidia platform service pods that are running on the **SAME** host. In the example below, all Nvidia resources are restarted on the node `ip-10-0-101-65.us-west-2.compute.internal`:

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

1.  To collect more debug information on the Nvidia platform service, run:

    ```bash
    helm get all nvidia -n kommander
    ```

1.  To validate metrics being produced and exported by the Nvidia DCGM exporter on a GPU node:

    ```bash
    kubectl exec -n kommander nvidia-nvidia-dcgm-exporter-s26r7 --tty -- wget -nv -O- localhost:9400/metrics
    ```

[libnvidia_container]: https://github.com/NVIDIA/libnvidia-container
[nvidia_container_runtime]: https://github.com/NVIDIA/nvidia-container-runtime
[nvidia_driver_installation_guide]: https://docs.nvidia.com/datacenter/tesla/tesla-installation-notes/#package-manager
[nvidia_public_hub_repository]: https://hub.docker.com/r/nvidia/driver
[nvidia_k8s_device_plugin]: https://github.com/NVIDIA/k8s-device-plugin
[nvidia_dcgm]: https://developer.nvidia.com/dcgm
[k8s_taints_and_tolerations]: https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/
