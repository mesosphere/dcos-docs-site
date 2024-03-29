---
layout: layout.pug
navigationTitle: Define the Control Plane Endpoint
title: Define Control Plane Endpoint
menuWeight: 60
excerpt: Define the Control Plane Endpoint for your cluster
beta: false
enterprise: false
---
A control plane should have three, five, or seven nodes, so that it can remain available if one, two, or three nodes fail. A control plane with one node should not be used in production.

In addition, the control plane should have an endpoint that remains available if some nodes fail.

```sh
                            -------- cp1.example.com:6443
                            |
      lb.example.com:6443 ---------- cp2.example.com:6443
                            |
                            -------- cp3.example.com:6443
```

In this example, the control plane endpoint host is `lb.example.com`, and the control plane endpoint port is `6443`. The control plane nodes are `cp1.example.com`, `cp2.example.com`, and `cp3.example.com`. The port of each API server is `6443`.

## External load balancer

It is recommended that an external load balancer be the control plane endpoint. To distribute request load among the control plane machines, configure the load balancer to send requests to all the control plane machines. Configure the load balancer to send requests only to control plane machines that are responding to API requests.

## Built-in virtual IP

If an external load balancer is not available, use the [built-in virtual IP](../create-cluster/#use-the-built-in-virtual-ip). The virtual IP is _not_ a load balancer; it does not distribute request load among the control plane machines. However, if the machine receiving requests does not respond to them, the virtual IP automatically moves to another machine.

## Single-Node control plane

A control plane with one node can use its single node as the endpoint, so you will not require an external load balancer, or a built-in virtual IP. However, do not use a single-node control plane configuration in production, as it is impossible to upgrade the control plane if you only have one node. This is because CAPI does not perform in-situ upgrades, instead, it replaces machines. If you want to upgrade your cluster, use the default `<code>`--control-plane-replicas`</code>` setting of 3.

When the API server endpoints are defined, you can [create the cluster][create-cluster].

## Known limitations

<p class="message--note"><strong>NOTE: </strong>Be aware of these limitations in the current release of Konvoy.</p>

The control plane endpoint port is also used as the API server port on each control plane machine. The default port is 6443. Before you create the cluster, ensure  the port is available for use on each control plane machine.

[create-cluster]: ../create-cluster
