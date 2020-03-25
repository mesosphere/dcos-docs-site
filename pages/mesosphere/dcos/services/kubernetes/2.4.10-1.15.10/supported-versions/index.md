---
layout: layout.pug
navigationTitle: Supported Versions
title: Supported Versions
menuWeight: 80
excerpt: Understanding DC/OS Kubernetes versions and policies
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-kubernetes-cluster -->

# Supported and Bundled Versions

DC/OS Kubernetes supports the following versions of DC/OS and DC/OS Enterprise:

- [DC/OS](https://dcos.io/) 1.12 or later.

DC/OS Kubernetes bundles the following versions of the base technology:

- [etcd](https://coreos.com/etcd/) 3.3.13.
- [Docker](https://www.docker.com/) 19.03.3.
- [Kubernetes](https://kubernetes.io/) 1.15.10.
    - [CoreDNS](https://coredns.io/) 1.6.5.
    - [Calico](https://www.projectcalico.org/) 3.13.1.
    - [Kubernetes Dashboard](https://github.com/kubernetes/dashboard/) 1.10.1.
    - [Metrics Server](https://github.com/kubernetes-incubator/metrics-server/) 0.3.3.
    - [Ark](https://github.com/heptio/ark) 0.9.7.

# Package Versioning Scheme

Packages are versioned with an `a.b.c-x.y.z` format, where `a.b.c` is the version of the DC/OS integration and `x.y.z` indicates the version of Kubernetes.
For example, `1.0.0-1.9.3` indicates version `1.0.0` of the DC/OS integration and version `1.9.3` of Kubernetes.

# Version Policy

The DC/OS Kubernetes Service is engineered and tested to work with a specific release of [Kubernetes](https://kubernetes.io).
We select stable versions of the base technology in order to promote customer success.
We have selected the latest stable version of Kubernetes for new releases.

# Contacting Technical Support

## Mesosphere DC/OS

[Submit a request](https://support.mesosphere.com/s/).
