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

[prerequisites-airgapped]: ../prerequisites-airgapped
[bootstrap]: ../bootstrap
