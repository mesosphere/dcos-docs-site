---
layout: layout.pug
navigationTitle: Load Balancing
title: Load Balancing
menuWeight: 20
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
The `iptables` mode of operation uses [DNAT][dnat] rules to distribute direct traffic to real servers, whereas [IPVS][ipvs] leverages in-kernel transport-layer load-balancing.
Read a [comparison between these two methods][ipvs_iptables_comparison].
By default, `kube-proxy` runs in `iptables` mode.
The kube-proxy configuration can be altered by updating the `kube-proxy` configmap in the `kube-system` namespace.

## Load balancing for external traffic

External traffic destined for the Kubernetes service requires a service of type `LoadBalancer`, through which external clients connect to your internal service.
Under the hood, it uses a load balancer provided by the underlying infrastructure to direct the traffic.

### In the Cloud

In cloud deployments, the load balancer is provided by the cloud provider.
For example, in AWS, the service controller communicates with the AWS API to provision an ELB service which targets the cluster nodes.

### On-premises

For an on-premises deployment, Kommander utilizes MetalLB. MetalLB will now be installed when creating your Kubernetes cluster, refer to [the Konvoy installation instructions](.../konvoy/2.2/choose-infrastructure/pre-provisioned/metal-lb) for new clusters.

[dnat]: https://www.linuxtopia.org/Linux_Firewall_iptables/x4013.html
[ipvs]: https://en.wikipedia.org/wiki/IP_Virtual_Server
[ipvs_iptables_comparison]: https://www.projectcalico.org/comparing-kube-proxy-modes-iptables-or-ipvs/
