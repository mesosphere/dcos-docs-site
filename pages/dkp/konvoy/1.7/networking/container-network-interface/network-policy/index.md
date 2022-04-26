---
layout: layout.pug
navigationTitle: Network Policy
title: Network Policy
menuWeight: 8
excerpt: Kubernetes and Calico Network Policy
beta: false
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

# Network Policy

A network policy specifies how groups of pods are allowed to communicate with
each other and with other network endpoints.

In Konvoy, network policies are implemented by Calico.

Calico supports a wide range of [network policies][calico_policy].
It is tightly integrated with Kubernetes network policy.
You can use `kubectl` to configure Kubernetes network policy which would be enforced by Calico.
Further, Calico extends Kubernetes network policy through custom CRDs which can be configured using [calicoctl][calicoctl].

For more information, see:

- [Calico network policy][calico_security]

[calico_policy]: https://docs.projectcalico.org/security/kubernetes-network-policy
[calico_security]: https://docs.projectcalico.org/security/
[calicoctl]: https://docs.projectcalico.org/getting-started/clis/calicoctl/install
