---
layout: layout.pug
navigationTitle: GPUs
title: GPUs
menuWeight: 150
excerpt: Configure GPU for Konvoy cluster
beta: false
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

This section describes the Nvidia GPU support on Konvoy. This document assumes familiarity with Kubernetes GPU support. The AMD GPU is currently not supported.

# Konvoy GPU Overview

GPU support on Konvoy is achieved by using the [nvidia-container-runtime][nvidia_container_runtime].
With the Nvidia GPU turned on, Konvoy configures the container runtime, for running GPU containers, and installs all the necessary items to power up the Nvidia GPU devices.
Konvoy runs every Nvidia GPU dependent component as daemonsets, making it easier to manage and upgrade.

<p class="message--note"><strong>NOTE: </strong> Starting from Konvoy 1.7, Konvoy assumes that the Nvidia driver is running on the host machine, in order to guarantee zero downtime during machine kernel upgrade. Users should make sure the Nvidia driver is running and healthy on the host before installing Konvoy. </p>

The following components provide Nvidia GPU support on Konvoy:

* [libnvidia-container][libnvidia_container] and [nvidia-container-runtime][nvidia_container_runtime]: Konvoy uses containerd as kubernetes container runtime by default. [libnvidia-container][libnvidia_container] and [nvidia-container-runtime][nvidia_container_runtime] shim between containerd and runc, which simplifies the container runtime integration with GPU support. Another benefit is this avoids using [nvidia-docker2][nvidia_docker].
* [Nvidia Device Plugin][nvidia_k8s_device_plugin]: Konvoy makes use of Nvidia GPUs via this Kubernetes device plugin. It enables running GPU enabled containers on Kubernetes, tracks the number of available GPUs on each node and their health.
* [NVIDIA Data Center GPU Manager][nvidia_dcgm]: Contains a Prometheus exporter that provides Nvidia GPU metrics.

## Requirements

1.  Centos 7 or Ubuntu 16.04/18.04 with the IPMI driver enabled and the Nouveau driver disabled.
    <!-- If you are running Ubuntu 18.04 with an AWS kernal, you also need to enable the i2c_core kernel module. -->

1.  NVIDIA GPU with Fermie architecture version 2.1 or greater.

1.  Nvidia driver must be running on each GPU host node. Nvidia driver version `450.51.06-1` is recommended. Follow the official [Nvidia Driver Installation Guide][nvidia_driver_installation_guide] to setup the driver on the host. For example,

<p class="message--important"><strong>IMPORTANT: </strong>For Konvoy versions v1.7.0, 1.7.1, 1.7.2, 1.7.3, and v1.7.4, Nvidia driver version 450.51.06-1 is recommended. For Konvoy versions v1.7.5, Nvidia driver version 460.73.01 is recommended.</p>

* Centos 7

```bash
sudo yum update -y
sudo yum -y group install "Development Tools"
sudo yum -y install kernel-devel epel-release dkms
sudo sed -i '/^GRUB_CMDLINE_LINUX=/s/"$/ module_name.blacklist=1 rd.driver.blacklist=nouveau modprobe.blacklist=nouveau"/' /etc/default/grub
sudo dracut --omit-drivers nouveau -f
sudo grub2-mkconfig -o /boot/grub2/grub.cfg
sudo reboot

lsmod | grep -i nouveau #ensure not loaded
sudo yum install -y tar bzip2 make automake gcc gcc-c++ pciutils elfutils-libelf-devel libglvnd-devel iptables firewalld vim bind-utils wget
distribution=rhel7
ARCH=$( /bin/arch )
sudo yum-config-manager --add-repo http://developer.download.nvidia.com/compute/cuda/repos/$distribution/${ARCH}/cuda-$distribution.repo
sudo yum install -y kernel-devel-$(uname -r) kernel-headers-$(uname -r)
sudo yum clean expire-cache
sudo yum install -y nvidia-driver-latest-dkms-3:450.51.06-1.el7.x86_64
```

* Ubuntu 16.04/18.04 LTS

```bash
sudo apt-get install linux-headers-$(uname -r)
distribution=$(. /etc/os-release;echo $ID$VERSION_ID | sed -e 's/\.//g')
wget https://developer.download.nvidia.com/compute/cuda/repos/$distribution/x86_64/cuda-$distribution.pin
sudo mv cuda-$distribution.pin /etc/apt/preferences.d/cuda-repository-pin-600

# Install the CUDA repository public GPG key. Note that on Ubuntu 16.04, replace https with http in the command below.
sudo apt-key adv --fetch-keys https://developer.download.nvidia.com/compute/cuda/repos/$distribution/x86_64/7fa2af80.pub

echo "deb http://developer.download.nvidia.com/compute/cuda/repos/$distribution/x86_64 /" | sudo tee /etc/apt/sources.list.d/cuda.list
sudo apt-get update
sudo apt-get -y install cuda-drivers-460
```

* Verify the Nvidia driver is running on the host

```bash
[centos@ip-10-0-130-28 ~]$ nvidia-smi
Fri Jun 11 09:05:31 2021
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 450.51.06    Driver Version: 450.51.06    CUDA Version: 11.0     |
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

### Enable Nvidia GPU on Konvoy

To enable Nvidia GPU support on Konvoy, add the Nvidia GPU `nodePools` in ClusterProvisioner and ClusterConfiguration, then enable the `nvidia` addon. Here is an example of the `cluster.yaml`:

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  provider: aws
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
---
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  nodePools:
  - name: gpu-worker
    gpu:
      nvidia: {}
  addons:
  - configRepository: https://github.com/mesosphere/kubernetes-base-addons
    configVersion: stable-1.20-4.2.0
    addonsList:
    - name: nvidia
      enabled: true
```

### How to prevent other workloads from running on GPU nodes

Use Kubernetes taints to ensure only dedicated workloads are deployed on GPU machines. You must add tolerations to your GPU workloads to deploy on the dedicated GPU nodes. See [Kubernetes Taints and Tolerations][k8s_taints_and_tolerations] for details.

Setting custom tolerations for an addon replaces the tolerations set in the config repository used for that addon. To add tolerations to an addon, while maintaining those set in the config repository, add the tolerations set in the config repository to your `cluster.yaml`.

Here is an example of `cluster.yaml` using custom taints and tolerations:

```yaml
kind: ClusterProvisioner
apiVersion: konvoy.mesosphere.io/v1beta2
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
      nvidia: {}
    labels:
      - key: dedicated
        value: gpu-worker
    taints:
      - key: dedicated
        value: gpu-worker
        effect: NoExecute
  addons:
  - configRepository: https://github.com/mesosphere/kubernetes-base-addons
    configVersion: stable-1.20-4.2.0
    addonsList:
......
    - name: nvidia
      enabled: true
      values: |
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

Konvoy uses the [NVIDIA Data Center GPU Manager][nvidia_dcgm] to export GPU metrics towards Prometheus. By default, Konvoy has a Grafana dashboard called `NVIDIA DCGM Exporter Dashboard` to monitor GPU metrics. This GPU dashboard is shown in Konvoy's Grafana UI.

## Upgrade

Konvoy is capable of automatically upgrading the Nvidia GPU addon. However, GPU workload needs to be drained if the Nvidia addon is being upgraded.

1.  Delete all GPU workloads on the GPU nodes where the Nvidia addon needs to be upgraded.

1.  Delete the existing Nvidia addon:

    ```bash
    kubectl delete clusteraddon nvidia
    ```

1. Wait for all Nvidia-related resources in the `Terminating` state to be cleaned up. You can check pod status with:

    ```bash
    kubectl get pod -A | grep nvidia
    ```

1.  Specify the desired `configVersion` in your `cluster.yaml`. Then, deploy addons to upgrade the Nvidia GPU addon:

    ```bash
    konvoy deploy addons
    ```

## Debugging

1.  Determine if all Nvidia pods are in `Running` state, as expected:

    ```bash
    kubectl get pod -A | grep nvidia
    ```

1.  If there are any Nvidia pods crashing, returning errors, or flapping, collect the logs for the problematic pod. For example:

    ```bash
    kubectl logs -n kube-system nvidia-kubeaddons-nvidia-device-plugin-dxtch
    ```

1.  To recover from this problem, you must restart all Nvidia-addon pods that are running on the **SAME** host. In the example below, all Nvidia resources are restarted on the node `ip-10-0-129-201.us-west-2.compute.internal`:

    ```bash
    $ kubectl get pod -A -o wide | grep nvidia
    kube-system    nvidia-kubeaddons-nvidia-device-plugin-dxtch                         1/1     Running     0          4m20s   192.168.57.153    ip-10-0-129-191.us-west-2.compute.internal   <none>           <none>
    kube-system    nvidia-kubeaddons-nvidia-device-plugin-j4dm2                         1/1     Running     0          4m20s   192.168.39.88     ip-10-0-128-134.us-west-2.compute.internal   <none>           <none>
    kube-system    nvidia-kubeaddons-nvidia-device-plugin-qb29b                         1/1     Running     0          4m20s   192.168.119.35    ip-10-0-128-208.us-west-2.compute.internal   <none>           <none>
    kubeaddons     nvidia-kubeaddons-nvidia-dcgm-exporter-8ngx9                         2/2     Running     0          4m20s   192.168.57.154    ip-10-0-129-191.us-west-2.compute.internal   <none>           <none>
    kubeaddons     nvidia-kubeaddons-nvidia-dcgm-exporter-mwwl6                         2/2     Running     0          4m20s   192.168.243.100   ip-10-0-129-201.us-west-2.compute.internal   <none>           <none>
    kubeaddons     nvidia-kubeaddons-nvidia-dcgm-exporter-ttjqs                         2/2     Running     0          4m20s   192.168.39.89     ip-10-0-128-134.us-west-2.compute.internal   <none>           <none>
    kubeaddons     nvidia-kubeaddons-nvidia-dcgm-exporter-xqj6r                         2/2     Running     0          4m20s   192.168.119.36    ip-10-0-128-208.us-west-2.compute.internal   <none>           <none>
    $ kubectl delete pod -n kubeaddons nvidia-kubeaddons-nvidia-dcgm-exporter-mwwl6
    pod "nvidia-kubeaddons-nvidia-dcgm-exporter-mwwl6" deleted
    $ kubectl delete pod -n kube-system nvidia-kubeaddons-nvidia-device-plugin-tsbk2
    pod "nvidia-kubeaddons-nvidia-device-plugin-tsbk2" deleted
    ```

1.  To collect more debug information on the Nvidia addon, run:

    ```bash
    helm get nvidia-kubeaddons
    ```

[libnvidia_container]: https://github.com/NVIDIA/libnvidia-container
[nvidia_container_runtime]: https://github.com/NVIDIA/nvidia-container-runtime
[nvidia_docker]: https://github.com/NVIDIA/nvidia-docker
[nvidia_driver_installation_guide]: https://docs.nvidia.com/datacenter/tesla/tesla-installation-notes/#package-manager
[nvidia_public_hub_repository]: https://hub.docker.com/r/nvidia/driver
[nvidia_k8s_device_plugin]: https://github.com/NVIDIA/k8s-device-plugin
[nvidia_dcgm]: https://developer.nvidia.com/dcgm
[k8s_taints_and_tolerations]: https://kubernetes.io/docs/concepts/configuration/taint-and-toleration/
