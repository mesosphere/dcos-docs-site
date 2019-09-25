---
layout: layout.pug
navigationTitle: Networking
title: Networking
menuWeight: 8
excerpt: Configure networking for Konvoy cluster
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

This section describes different networking components that come together to form Konvoy networking stack.
It assumes the familiarity with Kubernetes networking to explain the specifics of networking in Konvoy.

## Highly Available Control-Plane

Konvoy ships with highly available control plane in case of multi-master Kubernetes deployment.

### AWS

In the cloud, the high availability is provided through cloud provider load balancer.

### On-premise

In on-premise, Konvoy ships with [Keepalived][keepalived].
Keepalived provides two main functionalities - High Availability and Load Balancing.
It uses [VRRP][vrrp] (Virtual Router Redundancy Protocol) to provide high availability.
VRRP allows having a virtual IP (VIP) assigned to participating machines where it is active only on one of the machines.
VRRP provides high availability by ensuring that virtual IP is active as long as at least one of the participating machines is active.
Konvoy uses Keepalived for high availability of the control plane.

To use `Keepalived`:

* Identify and reserve a virtual IP (VIP) address from the networking infrastructure.

* Configure the networking infrastructure so that the reserved virtual IP address is reachable:
  * from all hosts specified in the inventory file.
  * from the computer that is used to deploy Kubernetes.

  If the reserved virtual IP address is in the same subnet as the rest of the cluster nodes then nothing more needs to be configured.
  However, if it is in a different subnet then one may need to configure appropriate routes to ensures connectivity with the virtual IP address.
  Further, the virtual IP address may share an interface with the primary IP address of the interface.
  In such cases, one needs to disable any IP or MAC spoofing from the infrastructure firewall.

The following example illustrates the configuration if the reserved virtual IP address is `10.0.50.20`:

```yaml
spec:
  kubernetes:
    controlPlane:
      controlPlaneEndpointOverride: "10.0.50.20:6443"
      keepalived:
        enabled: true
        interface: ens20f0 # optional
        vrid: 51           # optional
```

The IP address specified in `spec.kubernetes.controlPlane.controlPlaneEndpointOverride` is used for Keepalived VIP.
This value is optional if it is already specified in `inventory.yaml` as part of `all.vars.control_plane_endpoint`.
One could set `spec.kubernetes.controlPlane.keepalived.interface` to specify the network interface for the Keepalived VIP.
This field is optional.
If not set, Konvoy will automatically detect the network interface to use based on the route to the VIP.

Further, one could set `spec.kubernetes.controlPlane.keepalived.vrid` to specify the [Virtual Router ID][keepalived_conf] used by Keepalived.
This field is optional.
If not set, Konvoy will randomly pick a Virtual Router ID for you.

Keepalived is enabled by default for on-premise deployment. However, it could be disabled by setting `spec.kubernetes.controlPlane.keepalived.enabled` to false.
This is usually done where there is an on-premise load balancer which could be used for high availability of the control plane.

## Pod-to-Pod connectivity

Konvoy ships with [Calico][calico] as the default CNI plugin to provide pod-to-pod connectivity.
The yaml for the default installation can be viewed [here][calico_yaml].
Konvoy exposes two configurations in `cluster.yaml` for Calico - Calico version and PodSubnet. Both these configurations are optional.

By default, Konvoy would ship with the latest version of Calico available at the time of Konvoy release.
However, it can be configured to a specific version as shown below:

```yaml
spec:
  kubernetes:
    containerNetworking:
      calico:
        version: v3.8.0
```

Further, Calico IPV4 pool CIDR can be set via `spec.kubernetes.networking.podSubnet` in `cluster.yaml` as shown below:

```yaml
spec:
  kubernetes:
    networking:
      podSubnet: 192.168.0.0/16
      serviceSubnet: 10.0.51.0/24
```

Konvoy ships with the default CIDR as `192.168.0.0/16`. One needs to make sure that `podSubnet` should not overlap with `serviceSubnet`.

### Network Policy

Calico supports a wide range of [network policy][calico_policy].
It has tight integration with Kubernetes network policy.
One could use `kubectl` to configure Kubernetes network policy which would be enforced by Calico.
Further, Calico extends Kubernetes network policy through custom CRDs which can be configured using [calicoctl][calicoctl].
More details about Calico network policy can be found [here][calico_security]

## Service Discovery

Konvoy ships with [CoreDNS][coredns] to provide DNS based service discovery.
The default CoreDNS configuration is as shown below:

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

As shown in the above config, by default, CoreDNS is shipped with `error`, `health`, `prometheus`, `forward`, `loop`, `reload`, `loadbalance` plugins enabled.
The detail explanation of all these plugins can be found [here][coredns_plugins].

CoreDNS configuration can be modified by updating the configmap named `coredns` in `kube-system` namespace.

## Load Balancing

Discussion around Load Balancing can be split into two:

* Load balancing for the traffic within a Kubernetes cluster
* Load balancing for the traffic coming from outside the cluster

### Load balancing for internal traffic

Load balancing within a Kubernetes cluster is exposed through a service of type `ClusterIP`.
`ClusterIP` is similar to a virtual IP (VIP) which presents a single IP address to the client and load balance the traffic to the backends servers.
The actual load balancing happens via iptables rules or ipvs configuration which are programmed by a Kubernetes component called `kube-proxy`.
By default, `kube-proxy` runs in iptables mode.
It configures iptables to intercept any traffic destined towards `ClusterIP` and send traffic to the real servers based on the probabilistic iptables rules.
`Kube-proxy` configuration can be altered by updating the configmap named `kube-proxy` in the `kube-system` namespace.

### Load balancing for external traffic

Kubernetes service of type `LoadBalancer` requires a load balancer to connect an external client to internal service.

### AWS

In cloud, the load balancer is provided by the cloud provider.

### On-premise

In on-premise, Konvoy ships with [MetalLB][metallb].

To use MetalLB for add-on load balancing:

* Identify and reserve a virtual IP (VIP) address range from the networking infrastructure.

* Configure the networking infrastructure so that the reserved IP addresses is reachable:
  * from all hosts specified in the inventory file.
  * from the computer that is used to deploy Kubernetes.

If the reserved virtual IP addresses are in the same subnet as the rest of the cluster nodes then nothing more needs to be configured.
However, if it is in a different subnet then one may need to configure appropriate routes to ensures connectivity with the virtual IP address.
Further, the virtual IP addresses may share an interface with the primary IP address of the interface.
In such cases, one needs to disable any IP or MAC spoofing from the infrastructure firewall.

MetalLB can be configured in two modes - Layer2 and BGP.

The following example illustrates the Layer2 configuration in the `cluster.yaml` configuration file:

```yaml
spec:
  addons:
    addonsList:
    - name: metallb
      enabled: true
      values: |-
        configInline:
          address-pools:
          - name: default
            protocol: layer2
            addresses:
            - 10.0.50.25-10.0.50.50
```

The number of virtual IP addresses in the reserved range determines the maximum number of services with a type of `LoadBalancer` that you can create in the cluster.

MetalLB in `bgp` mode implements only a minimal functionality of BGP. It only advertizes the virtual IP to peer BGP agent.

The following example illustrates the BGP configuration in the `cluster.yaml` configuration file:

```yaml
spec:
  addons:
    addonsList:
    - name: metallb
      enabled: true
      values: |-
        configInline:
          peers:
          - my-asn: 64500
            peer-asn: 64500
            peer-address: 172.17.0.4
          address-pools:
          - name: my-ip-space
            protocol: bgp
            addresses:
            - 172.40.100.0/24
```

In the above configuration, `peers` defines the configuration of the BGP peer such as peer ip address and autonomous system number (asn).
The `address-pools` section is similar to `layer2` except the protocol.

Further, MetalLB supports advance BGP configuration which can be found [here][metallb_config].

One needs to make sure that MetalLB subnet should not overlap with `podSubnet` and `serviceSubnet`.

## Ingress

Konvoy ships with [Traefik][traefik] as the default ingress controller.
The default Traefik helm chart can be viewed [here][traefik_chart].
Traefik creates a service of type Load Balancer.
In the cloud, the cloud provider creates the appropriate load balancer.
In on-premise, by default, it uses MetalLB. MetalLB can be configured as discussed earlier.

Further, Traefik supports a lot of functionalities such as Name-based routing, Path-based routing, Traffic splitting etc.
Details of these functionalities can be viewed [here][traefik_fn].

[keepalived]: https://www.keepalived.org/doc/introduction.html
[vrrp]: https://en.wikipedia.org/wiki/Virtual_Router_Redundancy_Protocol
[keepalived_conf]: https://www.keepalived.org/doc/configuration_synopsis.html
[calico]: https://docs.projectcalico.org/v3.8/introduction
[calico_yaml]: https://docs.projectcalico.org/v3.8/manifests/calico.yaml
[calico_policy]: https://docs.projectcalico.org/v3.8/security/kubernetes-network-policy
[calico_security]: https://docs.projectcalico.org/v3.8/security
[calicoctl]: https://docs.projectcalico.org/v3.8/getting-started/calicoctl/install
[coredns]: https://coredns.io/
[coredns_plugins]: https://coredns.io/plugins
[metallb]: https://metallb.universe.tf/concepts/
[metallb_config]: https://metallb.universe.tf/configuration/
[traefik]: https://docs.traefik.io/
[traefik_chart]: https://github.com/helm/charts/tree/master/stable/traefik
[traefik_fn]: https://docs.traefik.io/user-guide/kubernetes
