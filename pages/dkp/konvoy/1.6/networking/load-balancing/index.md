---
layout: layout.pug
navigationTitle: Load Balancing
title: Load Balancing
menuWeight: 8
beta: false
enterprise: false
---

In a Kubernetes cluster, depending on the flow of traffic direction, there are two kinds of load balancing:

- Load balancing for the traffic within a Kubernetes cluster
- Load balancing for the traffic coming from outside the cluster

## Load balancing for internal traffic

Load balancing within a Kubernetes cluster is accessed through a `ClusterIP` service type.
`ClusterIP` presents a single IP address to the client and load balances the traffic going to this IP to the backend servers.
The actual load balancing happens using `iptables` or IPVS configuration. The `kube-proxy` Kubernetes component programs these.
The `iptables` mode of operation uses [DNAT][dnat] rules to distribute direct trafik to real servers, whereas [IPVS][ipvs] leverages in-kernel transport-layer load-balancing.
A comparision between these two methods can be found [here][ipvs_iptables_comparision].
By default, `kube-proxy` runs in `iptables` mode.
The kube-proxy configuration can be altered by updating the `kube-proxy` configmap in the `kube-system` namespace.

## Load balancing for external traffic

External traffic destined for the Kubernetes service requires a service of type `LoadBalancer`, through which external clients connect to your internal service.
Under the hood, it uses a load balancer provided by the underlying infrastructre to direct the traffic.

### In the Cloud

In cloud deployments, the load balancer is provided by the cloud provider.
For example, in AWS, the service controller communicates with the AWS API to provision an ELB service which targets the cluster nodes.

### On-premises

For an on-premises deployment, Konvoy ships with [MetalLB][metallb], which provides load-balancing services.

<p class="message--note"><strong>NOTE: </strong>Making a configuration change in <code>cluster.yaml</code> for the <code>metallb</code> addon running <code>konvoy deploy addons</code> may not result in the config change applying. This is <a href="https://github.com/danderson/metallb/issues/348#issuecomment-442218138" target="_blank">intentional behavior</a>. MetalLB refuses to adopt changes to the ConfigMap that breaks existing Services. You can force MetalLB to load those changes by deleting the metallb controller pod.</p>

To use MetalLB:

1. Identify and reserve a virtual IP (VIP) address range in your networking infrastructure.

NOTE: Make sure the MetalLB subnet does not overlap with `podSubnet` and `serviceSubnet`.

1. Configure your networking infrastructure so that the reserved IP addresses is reachable:

- from all hosts specified in the inventory file.
- from the computer used to deploy Kubernetes.

Your configuration is complete If the reserved virtual IP addresses are in the same subnet as the rest of the cluster nodes.
If it is in a different subnet you may need to configure appropriate routes to ensure connectivity with the virtual IP address.
If the virtual IP addresses share an interface with the primary IP address of the interface, you must disable any IP or MAC spoofing from the infrastructure firewall.

MetalLB can be configured in two modes: Layer2 and BGP.

The following example illustrates the Layer2 configuration in the `cluster.yaml` configuration file:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
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

The number of virtual IP addresses in the reserved range determines the maximum number of `LoadBalancer` service types you can create in the cluster.

MetalLB in `bgp` mode implements only a subset of the BGP protocol. In particular, it only advertises the virtual IP to peer BGP agent.

The following example illustrates the BGP configuration in the `cluster.yaml` configuration file:

```yaml
kind: ClusterConfiguration
apiVersion: konvoy.mesosphere.io/v1beta2
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

In the above configuration, `peers` defines the configuration of the BGP peer, such as peer ip address and `autonomous system number` (`asn`).
The `address-pools` section is similar to `layer2`, except for the protocol.

MetalLB also supports advanced BGP configuration, which can be found [here][metallb_config].

```bash
kubectl -n kubeaddons delete pod -l app=metallb,component=controller
```

[dnat]: https://www.linuxtopia.org/Linux_Firewall_iptables/x4013.html
[ipvs]: https://en.wikipedia.org/wiki/IP_Virtual_Server
[ipvs_iptables_comparision]: https://www.projectcalico.org/comparing-kube-proxy-modes-iptables-or-ipvs/
[metallb]: https://metallb.universe.tf/concepts/
[metallb_config]: https://metallb.universe.tf/configuration/
[metallb_intentional_behavior]: https://github.com/danderson/metallb/issues/348#issuecomment-442218138
