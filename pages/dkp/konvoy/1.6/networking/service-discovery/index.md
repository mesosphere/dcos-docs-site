---
layout: layout.pug
navigationTitle: Service Discovery
title: Service Discovery
menuWeight: 8
beta: false
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

Konvoy ships with [CoreDNS][coredns] to provide a DNS-based service discovery.
The default CoreDNS configuration is shown below:

```yaml
.:53 {
    errors
    health
    kubernetes cluster.local in-addr.arpa ip6.arpa {
       pods insecure
       upstream
       fallthrough in-addr.arpa ip6.arpa
    }
    prometheus :9153
    forward . /etc/resolv.conf
    loop
    reload
    loadbalance
}
```

As shown, by default, CoreDNS is shipped with `error`, `health`, `prometheus`, `forward`, `loop`, `reload`, and `loadbalance` plugins enabled.
A detailed explanation for these plugins can be found [here][coredns_plugins].

You can modify the CoreDNS configuration by updating the `configmap` named `coredns` in `kube-system` namespace.

[coredns]: https://coredns.io/
[coredns_plugins]: https://coredns.io/plugins
