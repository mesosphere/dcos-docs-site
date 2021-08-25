---
layout: layout.pug
navigationTitle: Define the Control Plane Endpoint
title: Define Control Plane Endpoint
menuWeight: 60
excerpt: Define the Control Plane Endpoint for your cluster
beta: true
enterprise: false
---

The control plane should have three, five, or seven nodes, so that it can remain available if one, two, or three nodes fail, respectively. A control plane with one node should not be used in production.

In addition, the control plane should have an endpoint that remains available if some nodes fail.

```text
                            -------- cp1.example.com:6443
                            |
      lb.example.com:6443 ---------- cp2.example.com:6443
                            |
                            -------- cp3.example.com:6443
```

In this example, the control plane endpoint host is `lb.example.com`, and the control plane endpoint port is `6443`. The control plane nodes are `cp1.example.com`, `cp2.example.com`, and `cp3.example.com`. The port of each API server is `6443`.

We recommend an external load balancer be the control plane endpoint. If an external load balancer is not available, use the built-in virtual IP. A control plane with one node, which should not be used in production, can use its single node as the endpoint.

When the API server endpoints are defined, you can [create the cluster](../create-cluster).

## Known Limitations

<p class="message--note"><strong>NOTE: </strong>Be aware of these limitations in the current release of Konvoy.</p>

- The port of each API server (`kube-apiserver`) is set to the same value as the control plane endpoint port.
