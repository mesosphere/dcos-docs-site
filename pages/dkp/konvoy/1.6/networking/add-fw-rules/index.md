---
layout: layout.pug
navigationTitle: Node firewall rules configuration
title: Node firewall rules configuration
menuWeight: 8
excerpt: Enable Konvoy to configure firewall rules for nodes
beta: false
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

Konvoy can configure firewall rules neccesary for the operation of the nodes in environments that have iptables firewalls enforcing traffic.
They ensure that all the necessary connectivity in the cluster is permitted.
Konvoy will add the following rules to iptables if configured to do so:

Control Plane nodes:

```text
iptables -A INPUT -p tcp -m tcp --dport 6443 -m comment --comment "Konvoy: kube-apiserver --secure-port" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 10250 -m comment --comment "Konvoy: kubelet --port" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 10248 -m comment --comment "Konvoy: kubelet --healthz-port" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 10249 -m comment --comment "Konvoy: kube-proxy --metrics-bind-address" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 10256 -m comment --comment "Konvoy: kube-proxy --healthz-port" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 10257 -m comment --comment "Konvoy: kube-controller-manager --secure-port" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 10259 -m comment --comment "Konvoy: kube-scheduler --secure-port" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 2379 -m comment --comment "Konvoy: etcd client" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 2380 -m comment --comment "Konvoy: etcd peer" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 9091 -m comment --comment "Konvoy: calico-node felix (used for metrics)" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 9092 -m comment --comment "Konvoy: calico-node bird (used for metrics)" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 9099 -m comment --comment "Konvoy: calico-node felix (used for liveness)" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 179 -m comment --comment "Konvoy: calico-node BGP" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 30000:32767 -m comment --comment "Konvoy: NodePorts" -j ACCEPT
iptables -A INPUT -p icmp -m comment --comment "Konvoy: ICMP" -m icmp --icmp-type 8 -j ACCEPT
```

Worker nodes:

```text
iptables -A INPUT -p tcp -m tcp --dport 10250 -m comment --comment "Konvoy: kubelet --port" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 10248 -m comment --comment "Konvoy: kubelet --healthz-port" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 10249 -m comment --comment "Konvoy: kube-proxy --metrics-bind-address" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 10256 -m comment --comment "Konvoy: kube-proxy --healthz-port" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 9091 -m comment --comment "Konvoy: calico-node felix (used for metrics)" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 9092 -m comment --comment "Konvoy: calico-node bird (used for metrics)" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 9099 -m comment --comment "Konvoy: calico-node felix (used for liveness)" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 5473 -m comment --comment "Konvoy: calico-typha (used for syncserver)" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 9093 -m comment --comment "Konvoy: calico-typha (used for metrics)" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 179 -m comment --comment "Konvoy: calico-node BGP" -j ACCEPT
iptables -A INPUT -p tcp -m tcp --dport 30000:32767 -m comment --comment "Konvoy: NodePorts" -j ACCEPT
iptables -A INPUT -p icmp -m comment --comment "Konvoy: ICMP" -m icmp --icmp-type 8 -j ACCEPT
```

This behavior is disabled by default. You can enable it by setting the value of `spec.kubernetes.iptables.addDefaultRules` to `true`.

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
spec:
  kubernetes:
    networking:
      iptables:
        addDefaultRules: true
```
