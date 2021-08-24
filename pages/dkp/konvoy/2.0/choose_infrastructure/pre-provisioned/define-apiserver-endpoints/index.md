---
layout: layout.pug
navigationTitle: Define APIServer Endpoints
title: Define APIServer Endpoints
menuWeight: 60
excerpt: Define the API Server endpoints for your infrastructure
beta: true
enterprise: false
---

<!-- markdownlint-disable MD030 MD034 -->

The control plane should consist of at least three nodes. This allows `etcd` to achieve a quorum, and ensures availability of the control plane in the event one node goes down. To maintain availability of the control plane, we recommend using an external load balancer.

```text
                            -------- cp1.example.com:6443
                            |
      lb.example.com:6443 ---------- cp2.example.com:6443
                            |
                            -------- cp3.example.com:6443
```

In this example, the APIserver endpoint is `lb.example.com:6443`.

<p class="message--note"><strong>NOTE: </strong>If you do not have a load balancer, or if you plan to configure one after cluster provisioning, use the first control plane node as your APIserver endpoint when creating the cluster.</p>

When the API sever endpoints are defined, you can [create the cluster](../create-cluster).
