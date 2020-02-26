---
layout: layout.pug
navigationTitle: Networking
title: Networking
menuWeight: 8
excerpt: Configure networking for Konvoy cluster
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

This section describes different networking components that come together to form a Konvoy networking stack. It assumes familiarity with Kubernetes networking.

# Highly Available Control Plane

Konvoy ships with a highly available control plane, in case of multi-master Kubernetes deployment.

## AWS

High availability is provided through the cloud provider's load balancer.

## On-premise

In on-premise deployments, Konvoy ships with [Keepalived][keepalived].
Keepalived provides two main functionalities - high availability and load balancing.
It uses the [VRRP][vrrp] (Virtual Router Redundancy Protocol) to provide high availability.
VRRP allows you assign a virtual IP (VIP) to participating machines, where it is active only on one of the machines.

VRRP provides high availability by ensuring that virtual IP is active as long as at least one of the participating machines is active.
Konvoy uses Keepalived to maintain high availability of the control plane.

To use `Keepalived`:

1. Identify and reserve a virtual IP (VIP) address from the networking infrastructure.

1. Configure the networking infrastructure so that the reserved virtual IP address is reachable:

-   from all hosts specified in the inventory file.
-   from the computer that is used to deploy Kubernetes.

If the reserved virtual IP address is in the same subnet as the rest of the cluster nodes then nothing more needs to be configured.
However, if it is in a different subnet you may need to configure appropriate routes to ensure connectivity with the virtual IP address.
Further, the virtual IP address may share an interface with the primary IP address of the interface.
In such cases, you must be able to disable any IP or MAC spoofing from the infrastructure firewall.

The following example illustrates the configuration if the reserved virtual IP address is `10.0.50.20`:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta1
spec:
  kubernetes:
    controlPlane:
      controlPlaneEndpointOverride: "10.0.50.20:6443"
      keepalived:
        enabled: true
        interface: ens20f0 # optional
        vrid: 51           # optional
```

The IP address specified in `spec.kubernetes.controlPlane.controlPlaneEndpointOverride` is used for the Keepalived VIP.
This value is optional if it is already specified in `inventory.yaml` as part of `all.vars.control_plane_endpoint`.
You can set `spec.kubernetes.controlPlane.keepalived.interface` to specify the network interface for the Keepalived VIP.
This field is optional; if not set, Konvoy automatically detects the network interface to use based on the route to the VIP.

Further, you could set `spec.kubernetes.controlPlane.keepalived.vrid` to specify the [Virtual Router ID][keepalived_conf] used by Keepalived.
This field is optional; if not set, Konvoy will randomly pick a Virtual Router ID for you.

Keepalived is enabled by default for on-premise deployment. You can disable it by setting `spec.kubernetes.controlPlane.keepalived.enabled` to `false`.
This is usually done where there is an on-premise load balancer which could be used to maintain high availability of the control plane.

# Pod-to-Pod connectivity

Konvoy ships with [Calico][calico] as the default CNI plugin to provide pod-to-pod connectivity.
The .yaml file for the default installation can be viewed [here][calico_yaml].
Konvoy exposes two configurations in `cluster.yaml`, for Calico - Calico version and PodSubnet. Both these configurations are optional.

By default, Konvoy ships with the latest version of Calico available at the time of Konvoy release.
However, you can configure it to a specific version as shown below:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta1
spec:
  kubernetes:
    containerNetworking:
      calico:
        version: v3.10.1
```

Further, the Calico IPV4 pool CIDR can be set via `spec.kubernetes.networking.podSubnet` in `cluster.yaml`, as shown below:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta1
spec:
  kubernetes:
    networking:
      podSubnet: 192.168.0.0/16
      serviceSubnet: 10.0.51.0/24
```

Konvoy ships with the default CIDR as `192.168.0.0/16`. Make sure that `podSubnet` does not overlap with `serviceSubnet`.

## Encapsulation

Two ways of encapsulating networking traffic are supported: IP-to-IP and VXLAN. By default, IP-to-IP is enabled:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta1
spec:
  kubernetes:
    containerNetworking:
      calico:
        encapsulation: ipip
```

The following configuration switches it to VXLAN:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta1
spec:
  kubernetes:
    containerNetworking:
      calico:
        encapsulation: vxlan
```

## Network Policy

Calico supports a wide range of [network policies][calico_policy].
It is tightly integrated with Kubernetes network policy.
You can use `kubectl` to configure Kubernetes network policy which would be enforced by Calico.
Further, Calico extends Kubernetes network policy through custom CRDs which can be configured using [calicoctl][calicoctl].
More details about Calico network policy can be found [here][calico_security].

## In-cluster BGP Route Reflectors

Calico advertises routes using BGP Protocol with the full node-to-node mesh configured by default.
That means all nodes connect to each other which becomes a problem on big clusters.
Konvoy has support for in-cluster BGP Route Reflectors.
Route Reflectors are essential on clusters with more than 200 nodes.
However, we recommend to have Route Reflectors on clusters with more than 100 nodes.
When Route Reflector nodes are configured, the full mesh mode is disabled and each node connects only to in-cluster Route Reflectors.
That reduces CPU and memory utilization on worker and control-plane nodes.
More information about Calico BGP Peers and Route Reflectors can be found [here][calico_bgp].

Route Reflector node requires at least 2 CPU Core and 4Gb Memory.
To enable in-cluster BGP Route Reflectors, add at least two nodes (three nodes are recommended) to the `route-reflector` node pool and add the following cluster configuration:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta1
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

# Service Discovery

Konvoy ships with [CoreDNS][coredns] to provide a DNS based service discovery.
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

As shown in the above configuration, by default, CoreDNS is shipped with `error`, `health`, `prometheus`, `forward`, `loop`, `reload`, `loadbalance` plugins enabled.
A detailed explanations for these plugins can be found [here][coredns_plugins].

You can modify the CoreDNS configuration by updating the `configmap` named `coredns` in `kube-system` namespace.

# Load Balancing

Load Balancing can be addressed in two ways:

* Load balancing for the traffic within a Kubernetes cluster
* Load balancing for the traffic coming from outside the cluster

## Load balancing for internal traffic

Load balancing within a Kubernetes cluster is exposed through a service of type `ClusterIP`.
`ClusterIP` is similar to a virtual IP (VIP) which presents a single IP address to the client and load balances the traffic to the backend servers.
The actual load balancing happens via `iptables` rules or ipvs configuration, which are programmed by a Kubernetes component called `kube-proxy`.
By default, `kube-proxy` runs in `iptables` mode.
It configures `iptables` to intercept any traffic destined towards `ClusterIP` and send traffic to the real servers based on the probabilistic `iptables` rules.
`Kube-proxy` configuration can be altered by updating the `configmap` named `kube-proxy` in the `kube-system` namespace.

## Load balancing for external traffic

A Kubernetes service of type `LoadBalancer` requires a load balancer to connect an external client to your internal service.

## AWS

In cloud deployments, the load balancer is provided by the cloud provider.

## On-premise

For an on-premise deployment, Konvoy ships with [MetalLB][metallb].

To use MetalLB for addon load balancing:

1. Identify and reserve a virtual IP (VIP) address range from the networking infrastructure.

1. Configure the networking infrastructure so that the reserved IP addresses is reachable:

- from all hosts specified in the inventory file.
- from the computer that is used to deploy Kubernetes.

If the reserved virtual IP addresses are in the same subnet as the rest of the cluster nodes, then nothing more needs to be configured.
However, if it is in a different subnet then you may need to configure appropriate routes to ensure connectivity with the virtual IP address.
Further, the virtual IP addresses may share an interface with the primary IP address of the interface.
In such cases, you must disable any IP or MAC spoofing from the infrastructure firewall.

MetalLB can be configured in two modes - Layer2 and BGP.

The following example illustrates the Layer2 configuration in the `cluster.yaml` configuration file:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta1
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

MetalLB in `bgp` mode implements only a minimal functionality of BGP. It only advertises the virtual IP to peer BGP agent.

The following example illustrates the BGP configuration in the `cluster.yaml` configuration file:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta1
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

In the above configuration, `peers` defines the configuration of the BGP peer such as peer ip address and `autonomous system number` (`asn`).
The `address-pools` section is similar to `layer2`, except for the protocol.

Further, MetalLB supports advanced BGP configuration which can be found [here][metallb_config].

***NOTE:*** Making a configuration change in `cluster.yaml` for the `metallb` addon running `konvoy deploy addons` may not result in the config change applying. This is intentional behavior. MetalLB will refuse to adopt changes to the ConfigMap that will break existing Services[&#185;]. You may force MetalLB to load those changes by deleting the metallb controller pod:

```bash
kubectl -n kubeaddons delete pod -l app=metallb,component=controller
```

Make sure the MetalLB subnet does not overlap with `podSubnet` and `serviceSubnet`.

# Ingress

Konvoy ships with [Traefik][traefik] as the default ingress controller.
The default Traefik helm chart can be viewed [here][traefik_chart].
Traefik creates a service of type Load Balancer.
In the cloud, the cloud provider creates the appropriate load balancer.
In on-premise deployment, by default, it uses MetalLB. MetalLB can be configured as discussed earlier.

Further, Traefik supports a lot of functionalities such as Name-based routing, Path-based routing, Traffic splitting etc.
Details of these functionalities can be viewed [here][traefik_fn].

[keepalived]: https://www.keepalived.org/doc/introduction.html
[vrrp]: https://en.wikipedia.org/wiki/Virtual_Router_Redundancy_Protocol
[keepalived_conf]: https://www.keepalived.org/doc/configuration_synopsis.html
[calico]: https://docs.projectcalico.org/v3.8/introduction
[calico_yaml]: https://docs.projectcalico.org/v3.8/manifests/calico.yaml
[calico_policy]: https://docs.projectcalico.org/v3.8/security/kubernetes-network-policy
[calico_security]: https://docs.projectcalico.org/v3.8/security
[calico_bgp]: https://docs.projectcalico.org/v3.8/networking/bgp
[calicoctl]: https://docs.projectcalico.org/v3.8/getting-started/calicoctl/install
[coredns]: https://coredns.io/
[coredns_plugins]: https://coredns.io/plugins
[metallb]: https://metallb.universe.tf/concepts/
[metallb_config]: https://metallb.universe.tf/configuration/
[traefik]: https://docs.traefik.io/
[traefik_chart]: https://github.com/helm/charts/tree/master/stable/traefik
[traefik_fn]: https://docs.traefik.io/v1.7/user-guide/kubernetes/
[&#185;]: https://github.com/danderson/metallb/issues/348#issuecomment-442218138
