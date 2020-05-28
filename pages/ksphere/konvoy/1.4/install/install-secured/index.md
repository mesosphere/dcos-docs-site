---
layout: layout.pug
navigationTitle: Install on secured machines
title: Install on secured machines
menuWeight: 37
excerpt: Install on secured machines
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

# Before you begin

Before installing, ensure that your environment has the following basic requirements:

* [Docker][install_docker] version 18.09.2 or later

  You must have Docker Desktop installed on the host where the Konvoy command line interface (CLI) will run.
  For example, if you are installing Konvoy on your laptop, be sure the laptop has a supported version of Docker Desktop.

* [kubectl][install_kubectl] v1.16.9 or later

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

## Kubernetes CVE Patches

At times, CVEs may be discovered in the Kubernetes codebase. Based on the severity and the impact of a specific CVE, you may want to temporarily use alternative docker images for the core Kubernetes components instead of the default `k8s.gcr.io` repository.
To do so, set the `version` and `imageRepository` as describe below.
The repository `docker.io/mesosphere` will contain patched images with a suffix of `+d2iq.1`, `+d2iq.2`, etc.

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta1
spec:
  kubernetes:
    version: 1.16.9+d2iq.2
    imageRepository: docker.io/mesosphere
```

[kubectl]: ../../operations/accessing-the-cluster#using-kubectl
[kubeconfig]: https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/
[install_docker]: https://docs.docker.com/get-docker/
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
