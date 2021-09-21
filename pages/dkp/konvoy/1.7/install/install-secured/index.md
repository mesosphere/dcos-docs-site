---
layout: layout.pug
navigationTitle: Install on secured machines
title: Install on secured machines
menuWeight: 37
excerpt: Install on secured machines
beta: false
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 MD018-->

# Before you begin

Before installing, ensure that your environment has the following basic requirements:

* [Docker][install_docker] version 18.09.2 or later

  You must have Docker installed on the host where the Konvoy command line interface (CLI) will run.
  For example, if you are installing Konvoy on your laptop, be sure the laptop has a supported version of Docker.

* [kubectl][install_kubectl] v1.19.15 or later

  To enable interaction with the running cluster, you must have `kubectl` installed on the host where the Konvoy command line interface (CLI) will run.

## Control plane nodes

* You should have at least three control plane nodes.

* Each control plane node should have at least:
  * 4 cores
  * 16 GiB memory
  * Disk usage must be below 85% on the root volume.
  * Approximately 80 GiB of free space for the volume used for `/var/lib/kubelet` and `/var/lib/containerd`.

## Worker nodes

* You should have at least four worker nodes.

  The specific number of worker nodes required for your environment varies depending on the cluster workload and size of the nodes.

* Each worker node should have at least:
  * 8 cores
  * 32 GiB memory
  * Disk usage must be below 85% on the root volume.
  * Approximately 80 GiB of free space for the volume used for `/var/lib/kubelet` and `/var/lib/containerd`.

* If you plan to use **local volume provisioning** to provide [persistent volumes][persistent_volume] for the workloads, you must mount at least three volumes to `/mnt/disks/` mount point on each node.
  Each volume must have **at least** 55 GiB of capacity if the default addon configurations are used.

## Operating system and services for all nodes

#include /dkp/konvoy/1.7/include/os-svc-nodes.tmpl

## Installation

On highly secured clusters you may need to modify the `cluster.yaml` file with additional options.
See the sample file below for possible changes that may be applied in your cluster.

## Kubernetes CVE Patches

At times, CVEs can be discovered in the Kubernetes codebase. Based on the severity and impact of a specific CVE, you can temporarily use alternative docker images for the core Kubernetes components instead of the default `k8s.gcr.io` repository.
To do so, set the `version` and `imageRepository` as describe below.
The repository `docker.io/mesosphere` will contain patched images with a suffix of `+d2iq.1`, `+d2iq.2`, etc.

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  kubernetes:
    version: 1.19.15+d2iq.1
    imageRepository: docker.io/mesosphere
```

## Konvoy with Universal Base Image

By default the Konvoy image has a Debian base image. However, if you organization only permits running images based on [Red Hat Universal Base Image(UBI)][ubi_image] you can use a different Docker image tag of Konvoy.

Run Konvoy with base image of `registry.access.redhat.com/ubi8/ubi:8.2`, replacing `<version>` with the version of Konvoy:

```text
export KONVOY_VERSION=<version>_ubi8
```

## IPTables

Kubernetes requires the hosts in the cluster with certain `iptables` rules.
Run the command below to check your `iptables` ruleset:

```text
iptables -L
Chain INPUT (policy DROP)
...
```

If you see `(policy DROP)`, Konvoy can be configured to automatically add the require `iptables` the rules outlined below.

Control Plane nodes:

```text
iptables -A INPUT -p tcp -m tcp --dport 6443 -m comment --comment "Konvoy: kube-apiserver --secure-port" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 10250 -m comment --comment "Konvoy: kubelet --port" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 10248 -m comment --comment "Konvoy: kubelet --healthz-port" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 10249 -m comment --comment "Konvoy: kube-proxy --metrics-bind-address" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 10256 -m comment --comment "Konvoy: kube-proxy --healthz-port" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 10257 -m comment --comment "Konvoy: kube-controller-manager --secure-port" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 10259 -m comment --comment "Konvoy: kube-scheduler --secure-port" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 2379 -m comment --comment "Konvoy: etcd client" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 2380 -m comment --comment "Konvoy: etcd peer" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 9091 -m comment --comment "Konvoy: calico-node felix (used for metrics)" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 9092 -m comment --comment "Konvoy: calico-node bird (used for metrics)" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 9099 -m comment --comment "Konvoy: calico-node felix (used for liveness)" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 179 -m comment --comment "Konvoy: calico-node BGP" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 30000:32767 -m comment --comment "Konvoy: NodePorts" -j ACCEPT
iptables -A INPUT -p icmp -m comment --comment "Konvoy: ICMP" -m icmp --icmp-type 8 -j ACCEPT
```

Worker nodes:

```text
iptables -A INPUT -p tcp -m tcp --dport 10250 -m comment --comment "Konvoy: kubelet --port" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 10248 -m comment --comment "Konvoy: kubelet --healthz-port" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 10249 -m comment --comment "Konvoy: kube-proxy --metrics-bind-address" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 10256 -m comment --comment "Konvoy: kube-proxy --healthz-port" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 9091 -m comment --comment "Konvoy: calico-node felix (used for metrics)" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 9092 -m comment --comment "Konvoy: calico-node bird (used for metrics)" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 9099 -m comment --comment "Konvoy: calico-node felix (used for liveness)" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 5473 -m comment --comment "Konvoy: calico-typha (used for syncserver)" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 9093 -m comment --comment "Konvoy: calico-typha (used for metrics)" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 179 -m comment --comment "Konvoy: calico-node BGP" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 30000:32767 -m comment --comment "Konvoy: NodePorts" -j ACCEPT
iptables -A INPUT -p icmp -m comment --comment "Konvoy: ICMP" -m icmp --icmp-type 8 -j ACCEPT
```

By default Konvoy will not modify the iptables on the Kubernetes machines, however, you can enable this behavior and have Konvoy automatically add the above `iptables` rules on the Kubernetes machines, by setting the value of `spec.kubernetes.iptables.addDefaultRules` to `true`.

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  kubernetes:
    networking:
      podSubnet: 192.168.0.0/16
      serviceSubnet: 10.0.0.0/18
      iptables:
        addDefaultRules: true
```

[install_docker]: https://docs.docker.com/get-docker/
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[persistent_volume]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/
[ubi_image]: https://www.redhat.com/en/blog/introducing-red-hat-universal-base-image
