---
layout: layout.pug
navigationTitle: Install on secured machines
title: Install on secured machines
menuWeight: 37
beta: true
excerpt: Install on secured machines
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

This section describes how to prepare your environment and install Konvoy in an air-gapped environment.
<p class="message--important"><strong>IMPORTANT: </strong>Air-gapped installation is still in Beta and the process may change in the future.</p>

# Before you begin

Before installing, ensure that your environment has the following basic requirements:

* [Docker Desktop][install_docker] version 18.09.2 or later

  You must have Docker Desktop installed on the host where the Konvoy command line interface (CLI) will run.
  For example, if you are installing Konvoy on your laptop, be sure the laptop has a supported version of Docker Desktop.

* [kubectl][install_kubectl] v1.16.8 or later

  To enable interaction with the running cluster, you must have `kubectl` installed on the host where the Konvoy command line interface (CLI) will run.

* The `konvoy_air_gapped.tar.bz2` that contains the required artifacts to perform an air-gapped installation.

## Control plane nodes

* You should have at least three control plane nodes.

* Each control plane node should have at least:
  * 4 cores
  * 16 GiB memory
  * 80 GiB of free space in the root partition, and the root partition must be less than 85% full.

## Worker nodes

* You should have at least four worker nodes.

  The specific number of worker nodes required for your environment varies depending on the cluster workload and size of the nodes.

* Each worker node should have at least:
  * 8 cores
  * 32 GiB memory
  * 80 GiB of free space in the root partition and the root partition must be less than 85% full.

* If you plan to use **local volume provisioning** to provide [persistent volumes][persistent_volume] for the workloads, you must mount at least three volumes to `/mnt/disks/` mount point on each node.
  Each volume must have **at least** 55 GiB of capacity if the default addon configurations are used.

## Operating system and services for all nodes

For all hosts that are part of the cluster -- except the **deploy host** -- you should verify the following configuration requirements:

* Firewalld is disabled.
* Containerd is uninstalled.
* Docker-ce is uninstalled.
* Swap is disabled.

## Installation

On highly secured clusters you may need to modify the `cluster.yaml` file with additional options.
See the sample file below for possible changes that may be applied in your cluster.

## Konvoy with Universal Base Image

By default the Konvoy image has a Debian base image. However, if you organization only permits running images based on [Red Hat Universal Base Image(UBI)][ubi_image] you can use a different Docker image tag of Konvoy.

Run Konvoy with base image of `registry.access.redhat.com/ubi8/ubi:8.1`, replacing `<version>` with the version of Konvoy:

```text
export KONVOY_VERSION=<version>-ubi8
```

### IPTables

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
iptables -A INPUT -p tcp -m tcp --dport 10252 -m comment --comment "Konvoy: kube-controller-manager --port (used for liveness)" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 10259 -m comment --comment "Konvoy: kube-scheduler --secure-port" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 10251 -m comment --comment "Konvoy: kube-scheduler --port (used for liveliness)" -j ACCEPT
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

The default value is `false`, however, you can enable this behavior by setting the value of `spec.kubernetes.iptables.addDefaultRules` to `true`.

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta1
spec:
  kubernetes:
    networking:
      podSubnet: 192.168.0.0/16
      serviceSubnet: 10.0.0.0/18
      iptables:
        addDefaultRules: true
```

[kubectl]: ../../operations/accessing-the-cluster#using-kubectl
[kubeconfig]: https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/
[install_docker]: https://www.docker.com/products/docker-desktop
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[ansible]: https://www.ansible.com
[persistent_volume]: https://kubernetes.io/docs/concepts/storage/persistent-volumes/
[ansible_inventory]: https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html
[ansible_group]: https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html#inventory-basics-hosts-and-groups
[keepalived]: https://www.keepalived.org/
[vrrp]: https://en.wikipedia.org/wiki/Virtual_Router_Redundancy_Protocol
[kubernetes_service]: https://kubernetes.io/docs/concepts/services-networking/service/
[metallb]: https://metallb.universe.tf
[ops_portal]: ../../operations/accessing-the-cluster#using-the-operations-portal
[local_persistent_volume]: https://kubernetes.io/docs/concepts/storage/volumes/#local
[static_pv_provisioner]: https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner
[static_pv_provisioner_operations]: https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner/blob/master/docs/operations.md
[calico]: https://www.projectcalico.org/
[coredns]: https://coredns.io/
[aws_ebs_csi]: https://github.com/kubernetes-sigs/aws-ebs-csi-driver
[elasticsearch]: https://www.elastic.co/products/elastic-stack
[elasticsearch_exporter]: https://www.elastic.co/guide/en/elasticsearch/reference/7.2/es-monitoring-exporters.html
[helm]: https://helm.sh/
[kibana]: https://www.elastic.co/products/kibana
[fluentbit]: https://fluentbit.io/
[prometheus_operator]: https://prometheus.io/
[grafana]: https://grafana.com/
[prometheus_adapter]: https://github.com/DirectXMan12/k8s-prometheus-adapter
[traefik]: https://traefik.io/
[osi]: https://en.wikipedia.org/wiki/OSI_model
[kubernetes_dashboard]: https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/
[velero]: https://velero.io/
[dex]: https://github.com/dexidp/dex
[dex_k8s_authenticator]: https://github.com/mesosphere/dex-k8s-authenticator
[traefik_foward_auth]: https://github.com/thomseddon/traefik-forward-auth
[static_lvp]: https://github.com/kubernetes-sigs/sig-storage-local-static-provisioner
[selinux-rpm]: http://mirror.centos.org/centos/7/extras/x86_64/Packages/container-selinux-2.107-3.el7.noarch.rpm
[containerd_mirrors]: https://github.com/containerd/cri/blob/master/docs/registry.md#configure-registry-endpoint
[ubi_image]: https://www.redhat.com/en/blog/introducing-red-hat-universal-base-image
