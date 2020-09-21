---
layout: layout.pug
navigationTitle: Calico
title: Calico
menuWeight: 8
excerpt: Calico Container Networking Interface
beta: true
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

# Calico

The Container Network Interface (CNI) specification defines a standard plugin interface for Linux container networking. CNI concerns itself only with network connectivity of containers and removing allocated resources when the container is deleted.

Konvoy ships with the latest version of [Calico][calico] as the CNI plugin to provide pod-to-pod network connectivity.

## Calico Customizations

- [BGP Route Reflectors](bgp-route-reflectors)
- [CIDR Pool](cidr-pools)
- [Calico Version](calico-version)
- [Encapsulation](encapsulation)
- [Network Policy](network-policy)

For more information, see:

- [Calico manifest for Kubernetes][calico_yaml]

[calico]: https://docs.projectcalico.org/introduction/
[calico_yaml]: https://docs.projectcalico.org/v3.13/manifests/calico.yaml
