---
layout: layout.pug
navigationTitle: Calico BGP Route Reflectors
title: Calico BGP Route Reflectors
menuWeight: 8
excerpt: Configure in-cluster BGP route reflectors for Calico
beta: false
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

# In-cluster BGP Route Reflectors

By default, Calico advertises routes using the BGP Protocol with a full node-to-node mesh.
Every node peers to every other node to broadcast routes which tends to no longer be scalable beyond 200 nodes.
Konvoy has support for Calico in-cluster BGP Route Reflectors. We recommend configuring them on clusters with more than 100 nodes.
When Route Reflector nodes are configured, the full mesh mode is disabled and each node connects only to in-cluster Route Reflectors. This reduces CPU and memory utilization on worker and control-plane nodes.

## Enable In-Cluster BGP Route Reflectors

To enable in-cluster BGP Route Reflectors, add at least two nodes (three nodes are recommended) to the `route-reflector` node pool in `cluster.yaml`:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  nodePools:
  - name: route-reflector
    labels:
      - key: dedicated
        value: route-reflector
    taints:
      - key: dedicated
        value: route-reflector
        effect: NoExecute
```

<p class="message--note"><strong>NOTE: </strong>Route Reflector nodes require at least 2 CPU Core and 4Gb Memory.</p>

For more information, see:

- [Calico BGP Peers and Route Reflectors][calico_bgp]

[calico_bgp]: https://docs.projectcalico.org/networking/bgp
