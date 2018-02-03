---
layout: layout.pug
navigationTitle:  Networking
title: Networking
menuWeight: 70
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->



The DC/OS network stack provides IP connectivity to containers, has built-in DNS-based service discovery, and provides layer 4 and layer 7 load balancing.

The following sections describe these features in more detail.

# IP connectivity
A container running on DC/OS can obtain an IP address using one of three networking modes:
* Host networking
* Bridge networking
* Container networking

These three networking modes are available for containers irrespective of the container runtime (UCR or Docker) that they choose to launch their container. 

## Host mode networking
In host mode, the container runs on the same network as other DC/OS system services such as Mesos and Marathon. In other words they share the same linux network namespace and therefore see the same IP address and ports as seen by DC/OS system services. Host mode networking is the most restrictive in the sense that it does not allow the container to use the entire TCP/UDP port range, and the application has to be adaptible to use whatever ports are available on a given agent. 

## Bridge mode networking
In this mode, containers are launched on an isolated linux bridge, created within the DC/OS agent. Containers running in this mode get their own linux network namespace, and hence their own IP address and are able to use the entire TCP/UDP port range. This networking mode is very useful when the application port is already fixed. The main caveat of using bridge mode networking is that in order for the container to be accessible from outside the agent, D-NAT rules would need to be installed on the agent. Both UCR and Docker bridge mode networking use this mechanism (also referred to as port-mapping) to expose services within the container to clients running outside the agent.

## Container mode networking
In this mode containers are allowed to run on a wide variety of software-defined networks. DC/OS supports the [CNI(Container network interface)](https://github.com/containernetworking/cni) standard for UCR containers, and [CNM(Container network model)](https://github.com/docker/libnetwork) standard for Docker containers. Using CNI and CNM, DC/OS is able to plumb containers onto any virtual network defined by an SDN provider that supports the CNI or CNM standard. Of the three modes this is the most powerful since the containers get their own linux network namespace and connectivity between containers is guaranteed by the underlying SDN network without the need to rely on D-NAT rules on the agent. Further, since SDNs can provide network isolation through firewalls, and are very flexible, it makes it easy for the operator to run multi-tenant clusters. This networking mode also allows the container's network to be completely isolated from the host network, thus giving an extra level of security to the host-network by protecting it from DDOS attacks from malicious containers running on top of DC/OS.


# DNS-Based Service Discovery
DC/OS includes a highly available, distributed, DNS-based service discovery. The DNS-based service discovery is available to containers running on DC/OS irrespective of the networking mode that they are running on. The service discovery mechanism in DC/OS contains these components:

- A centralized component called Mesos DNS, which runs on every master.
- A distributed component called dcos-dns, that runs as an application with an Erlang VM called dcos-net. The ErLang VM dcos-net runs on every node (agents and masters) in the cluster.

## Mesos DNS
Mesos DNS is a centralized, replicated, DNS server that runs on every master. Every task started by DC/OS gets a well-known DNS name. This provides a replicated highly available DNS service on each of the masters. Every instance of Mesos DNS polls the leading Mesos master and generates a fully qualified domain name (FQDN) for every service running in DC/OS with the domain `*.mesos`.  For more information, see the [Mesos DNS documentation](/pages/1.11/networking/DNS/mesos-dns/).

## Local DNS Forwarder (dcos-dns)
*dcos-dns* acts as a DNS masquerade for Mesos DNS on each agent. The dcos-dns instance on each agent is configured to listen to three different local interfaces on the agent and the nameservers on the agent are set to these three interfaces. This allows containers to perform up to three retries on a DNS request. To provide a highly available DNS service, dcos-dns forwards each request it receives to the different Mesos DNS instances which are running on each master.

The dcos-dns instance on each agent also acts as a DNS server for any service that is load balanced using the DC/OS internal load balancer called [dcos-l4lb](/pages/1.11/networking/load-balancing-vips/). Any service that is load balanced by dcos-l4lb gets a [virtual-ip-address (VIP)](/pages/1.11/networking/load-balancing-vips/virtual-ip-addresses/) and an FQDN in the `"*.l4lb.thisdcos.directory"` domain. The FQDN allocated to a load-balanced service is then stored in dcos-dns. All dcos-dns instances exchange the records they have discovered locally from dcos-l4lb by using GOSSIP. This provides a highly available distributed DNS service for any task that is load balanced by Minuteman. For more information, see the [dcos-net repository](https://github.com/dcos/dcos-net/blob/master/docs/dcos_dns.md).

# Load Balancing
DC/OS offers different options for layer-4 and layer 7 load balancing. The following sections describe the various features provided at both these layers.

## Layer 4
*[dcos-l4lb](/pages/1.11/networking/load-balancing-vips/)* is a distributed layer 4 east-west load balancer that is installed by default. 
It's highly scalable and highly available, offering 0 hop load balancing, no single choke point,
and tolerance to host failures. 

dcos-l4lb runs as an application within the Erlang VM *dcos-net* which runs on all agents and masters within the cluster.


## Layer 7
There are two packages within DC/OS that provide layer 7 load-balancing for DC/OS services, [Edge-LB](/pages/services/edge-lb) and [Marathon-LB](/pages/services/marathon-lb). Both these packages use HAProxy as its data-plane for load-balancing north-south traffic ingressing into the cluster. While these packages are primarily used to provide layer 7 load balancing (supporting HTTP and HTTPS) they can also be used to be provide layer 4 load balancing for TCP and SSL traffic. 

While the data-plane used by both these packages is fundamentally the same (HAProxy), the control-plane provided by these packages are vastly different. Edge-lb is the more recent of the two and is richer in its featureset compared to Marathon-LB. Edge-LB has the ability to support pools of HAProxy load-balancing instances, allowing it support multi-tenant deployments. It comes with it own CLI to configure and launch pools, and supports not only Marathon tasks but also tasks managed by custom Mesos framesworks that want to expose their tasks outside the cluster. 

Marathon-LB is a much simpler version of Edge-LB and manages a single instance of HAProxy. It also can load-balance only Marathon tasks and cannot be used to load-balance tasks launched by custom frameworks that are not visible to Marathon.

Edge-LB is available only for DC/OS Enterprise and currently is not supported on DC/OS open, while Marathon-LB is available for open as well as enterprise versions of DC/OS.

While both Marathon-LB and Edge-LB are primarily designed to be used for handling north-south ingress traffic, they can be used for internal east-west layer 7 load-balancing, and even layer 4 east-west load-balancing when necessary. The table below gives a comparitive analysis of the different load-balancing solutions present in DC/OS.


|                                    | dcos-l4lb | Edge-LB | Marathon-LB |
|-----                               |-----------|---------|---|
| Open Source                        |     X     |         |      X      |
| Enterprise                         |     X     |    X    |      X      |
| North-South (External to Internal) |           |    X    |      X      |
| East-West (Internal to Internal)    |     X     |    X    |      X      |
| Layer 4 (Transport Layer)          |     X     |    X    |      X      |
| Layer 7 (Application Layer)        |           |    X    |      X      |
| Marathon Services                  |     X     |    X    |      X      |
| Non-Marathon Service Tasks         |     X     |    X    |             |
| 0 hop load balancing               |     X     |         |             |
| No single point of failure         |     X     |         |             |


# A Note on Software Re-architecture
In DC/OS 1.11 most of the networking components such `dcos-dns`, `dcos-l4lb`, `dcos-overlay`, are applications that run as part of a single systemD unit called `dcos-net` running on all nodes of the cluster. It is important to note that prior to DC/OS 1.11 each of the applications `dcos-dns`, `dcos-l4lb`, and `dcos-overlay` were running as separate systemD units. Prior to DC/OS 1.11 role of `dcos-dns` was fulfilled by `spartan`, `dcos-l4lb` was fulfilled by `minuteman` and `dcos-overlay` was fulfilled by `navstar`. In DC/OS 1.11 the different systemD units were aggregated into a single service. The main advantage of following this operational pattern is that it has lead to better efficiency in terms of resource utilization (lower CPU consumption and higher throughput), and has also made the networking services a lot more robust and reliable, not to mention that this approach has made the code a lot more maintainable. 

It's important to note that from a functionality standpoint DC/OS 1.11 provides exactly the same, or better functionality, when compared to prior versions of DC/OS, except with better efficieny in terms of resource utilization. Thus, even though this software re-architecture has changed the internal machinery for providing networking services within DC/OS, from a functional UX standpoint the operator should not see any difference.



