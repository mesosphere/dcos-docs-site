---
layout: layout.pug
navigationTitle: Container Network Interface
title: Calico
menuWeight: 8
excerpt: Calico Container Networking Interface
beta: false
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

# Container Network Interface

The Container Network Interface (CNI) specification defines a standard plugin interface for Linux container networking. CNI concerns itself with network connectivity of containers and removing allocated resources when the container is deleted.

Konvoy ships with the latest version of [Calico][calico] as the CNI plugin to provide pod-to-pod network connectivity.

## Calico Customizations

- [Calico BGP Route Reflectors](calico-bgp-route-reflectors)
- [CIDR Pool](cidr-pools)
- [Calico Version](calico-version)
- [Calico Encapsulation](calico-encapsulation)
- [Network Policy](network-policy)

For more information, see:

- [Introduction to Calico][calico]
- [Calico manifest for Kubernetes][calico_yaml]

[calico]: https://docs.projectcalico.org/about/about-calico
[calico_yaml]: https://docs.projectcalico.org/v3.13/manifests/calico.yaml
