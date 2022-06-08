---
layout: layout.pug
navigationTitle: Prerequisites
title: Prerequisites
menuWeight: 10
excerpt: Fulfill the prerequisites for using a pre-provisioned infrastructure
enterprise: false
beta: false
---

Before you begin using Konvoy, you must have:

- An x86_64-based Linux or macOS machine.
- The `dkp` binary for Linux, or macOS.
- [kubectl][install_kubectl] for interacting with the running cluster.
- Pre-provisioned hosts with SSH access enabled.
- An unencrypted SSH private key, whose public key is configured on the above hosts.

[install_kubectl]: https://kubernetes.io/docs/tasks/tools/#kubectl

When air-gapped, you must follow the steps described in the [air-gapped prerequisites page][prerequisites-airgapped], otherwise [begin creating the bootstrap cluster][bootstrap].

## Control plane nodes

You should have at least three control plane nodes.

Each control plane node should have at least:

- 4 cores
- 16 GiB memory
- Approximately 80 GiB of free space for the volume used for `/var/lib/kubelet` and `/var/lib/containerd`.
- Disk usage must be below 85% on the root volume.

## Worker nodes

For Enterprise, the recommendation is at least four worker nodes. The specific number of worker nodes required for your environment can vary depending on the cluster workload and size of the nodes.  (See below for minimal suggested requirements)

Each worker node should have at least:

- 8 cores
- 32 GiB memory
- Around 80 GiB of free space for the volume used for `/var/lib/kubelet` and `/var/lib/containerd`.
- Disk usage must be below 85% on the root volume.

If you plan to use local volume provisioning to provide persistent volumes for your workloads, you must mount at least four volumes to the `/mnt/disks/` mount point on each node. Each volume must have at least 55 GiB of capacity.

[prerequisites-airgapped]: ../prerequisites-airgapped
[bootstrap]: ../bootstrap
