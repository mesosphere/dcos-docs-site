---
layout: layout.pug
navigationTitle: Prerequisites
title: Prerequisites
menuWeight: 10
excerpt: Prepare your machine and environment to run DKP
enterprise: true
---

## Konvoy prerequisites

Before you begin using Konvoy, you must have:

- An x86_64-based Linux or macOS machine.
- A [Self-managed Azure cluster](../../../azure/advanced/self-managed/)
- The `dkp` binary for Linux, or macOS.
- [Docker][install_docker] version 18.09.2 or later installed.
- [kubectl][install_kubectl] for interacting with the running cluster.
- [Azure CLI][azure_cli].
- A valid Azure account with [credentials configured][quick-start-azure-creds].

<p class="message--note"><strong>NOTE: </strong>On macOS, Docker runs in a virtual machine. Configure this virtual machine with at least 8GB of memory.</strong></p>

When completed, move on to create [the bootstrap cluster][aa-bootstrap].

[aa-bootstrap]: ../aa-bootstrap
[install_docker]: https://docs.docker.com/get-docker/
[install_kubectl]: https://kubernetes.io/docs/tasks/tools/#kubectl
[azure_cli]: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli
[quick-start-azure-creds]: ../../aks-quickstart/
