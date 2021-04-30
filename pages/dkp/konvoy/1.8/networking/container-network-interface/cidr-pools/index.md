---
layout: layout.pug
navigationTitle: CIDR Pools
title: CIDR Pools
menuWeight: 8
excerpt: Configure custom CIDR pools
beta: false
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

# CIDR Pools

There are two pools used for allocating addresses in Kubernetes: one for pods and one for services.
Konvoy ships with the default pod CIDR of `192.168.0.0/16` and a service CIDR of `10.0.0.0/18`.

## Configure Custom CIDR Pools

The IPV4 CIDR pools used by Calico can be set using two optional settings `spec.kubernetes.networking.podSubnet` and `spec.kubernetes.networking.serviceSubnet` in `cluster.yaml`:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  kubernetes:
    networking:
      podSubnet: 192.168.0.0/16
      serviceSubnet: 10.0.51.0/24
```

<p class="message--warning"><strong>WARNING: </strong>Ensure that <code>podSubnet</code> and <code>serviceSubnet</code> pools do not overlap.</p>
<p class="message--warning"><strong>WARNING: </strong>Changing <code>podSubnet</code> or <code>serviceSubnet</code> pools after the initial cluster creation is not supported and will render your cluster inoperable.</p>

For more information see:

- [Kubernetes Network Model](https://kubernetes.io/docs/concepts/cluster-administration/networking/#the-kubernetes-network-model)
- [Kubernetes Services](https://kubernetes.io/docs/concepts/services-networking/service/)
