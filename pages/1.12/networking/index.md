---
layout: layout.pug
navigationTitle:  Networking
title: Networking
menuWeight: 70
excerpt: Understanding the DC/OS networking stack

enterprise: false
---

<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->

The DC/OS network stack provides 
- [IP connectivity to containers](#IP-connectivity)
- built-in [DNS-based service discovery](#DNS-discovery)
- layer 4 and layer 7 [load balancing](#load-balancing)

# <a name="IP-connectivity"></a>IP connectivity
A container running on DC/OS can obtain an IP address using one of the three networking modes:
* [Host mode networking](#host-mode)
* [Bridge mode networking](#bridge-mode)
* [Container mode networking](#container-mode)

These three networking modes are available for all the containers regardless of the container runtime (UCR or Docker) used to launch them.

## <a name="host-mode"></a>Host mode networking
In host mode, the containers run on the same network as the other DC/OS system services such as Mesos and Marathon. They share the same Linux network namespace and see the same IP address and ports seen by DC/OS system services. Host mode networking is the most restrictive; it does not allow the containers to use the entire TCP/UDP port range, and the applications have to be able to use whatever ports are available on an agent.

## <a name="bridge-mode"></a>Bridge mode networking
In bridge mode, the containers are launched on a Linux bridge, created within the DC/OS agent. Containers running in this mode get their own Linux network namespace and IP address; they are able to use the entire TCP/UDP port range. This mode is very useful when the application port is fixed. The main issue with using this mode is that the containers are accessible only through port-mapping rules to the containers running on another agent. Both UCR and Docker install port-mapping rules for any container that is launched on bridge mode networking.

## <a name="container-mode"></a>Container mode networking
In this mode, the containers are allowed to run on a wide variety of software-defined networks (SDNs). DC/OS supports the [CNI (Container network interface)](https://github.com/containernetworking/cni) standard for UCR containers, and [CNM (Container network model)](https://github.com/docker/libnetwork) standard for Docker containers. Using CNI and CNM, DC/OS is able to plumb containers onto any virtual network defined by an SDN provider that supports the CNI or CNM standard. Of the three modes, this is the most flexible and feature-rich since the containers get their own Linux network namespace and connectivity between containers is guaranteed by the underlying SDN network without the need to rely on port-mapping rules on the agent. Further, since SDNs can provide network isolation through firewalls, and are very flexible, it makes it easy for the operator to run multi-tenant clusters. This networking mode also allows the container's network to be completely isolated from the host network, thus giving an extra level of security to the host-network by protecting it from DDOS attacks from malicious containers running on top of DC/OS.


# <a name="DNS-discovery"></a>DNS-Based Service Discovery
DC/OS includes a highly available and distributed DNS-based service discovery. This feature is available to all the containers running on DC/OS regardless of the networking mode that they use. The DNS-based service discovery mechanism in DC/OS is supported by following two components:

- A centralized component called Mesos DNS, which runs on every master.
- A distributed component called `dcos-dns`, that runs as an application within an Erlang VM called `dcos-net`. The Erlang VM `dcos-net` runs on every node (agents and masters) in the cluster.

## Mesos DNS
Mesos DNS is a centralized and replicated, DNS server that runs on every master. Each instance of Mesos DNS polls the leading Mesos master and generates a fully qualified domain name (FQDN) for every application launched by DC/OS. All these FQDNs have the top level domain (TLD) of `.mesos`.  For more information, see the [Mesos DNS documentation](/1.12/networking/DNS/mesos-dns/).

## DCOS DNS
`dcos-dns` is a distributed DNS server that runs on each agent as well as master, as part of an Erlang VM called `dcos-net`. This makes it highly available. The instance that is running on the leading master periodically polls the leading master state and generates FQDNs for every application launched by DC/OS. It then sends this information to its peers in the cluster. All these FQDNs have a TLD of `.directory`.

`dcos-dns` intercepts all DNS queries originating within an agent. If the query ends with `.directory` TLD then it is resolved locally; if it ends with `.mesos` then `dcos-dns` forwards the query to one of the `mesos-dns` running on the masters. Otherwise, it forwards the query to the configured upstream DNS server based on the TLD.   

`dcos-dns` also acts as a DNS server for any service that is load balanced using the DC/OS internal load balancer called [dcos-l4lb](/1.12/networking/load-balancing-vips/). Any service that is load balanced by dcos-l4lb gets a [virtual-ip-address (VIP)](/1.12/networking/load-balancing-vips/virtual-ip-addresses/) and an FQDN in the `"*.l4lb.thisdcos.directory"` domain. The FQDN is then stored in dcos-dns and sent to rest of the peers in the cluster. This provides a highly available distributed DNS service for any task that is load balanced by Minuteman. For more information, see the [dcos-net repository](https://github.com/dcos/dcos-net/blob/master/docs/dcos_dns.md).

# <a name="load-balancing"></a>Load Balancing
DC/OS offers different options for layer-4 and layer 7 load balancing. The following sections describe the various features provided at both these layers.

## Layer 4
[dcos-l4lb](/1.12/networking/load-balancing-vips/) is a distributed layer 4 east-west load balancer  installed by default. It is highly scalable and highly available, offering zero-hop load balancing, no single choke point and a tolerance to host failures. `dcos-l4lb` runs as an application within the Erlang VM `dcos-net`, which runs on all agents and masters within the cluster.

## Layer 7
There are two packages within DC/OS that provide layer 7 load-balancing for DC/OS services, [Edge-LB](/services/edge-lb/) and [Marathon-LB](/services/marathon-lb/). Both these packages use HAProxy as their data-plane for load-balancing north-south traffic entering the cluster. While these packages are primarily used to provide layer 7 load balancing (supporting HTTP and HTTPS), they can also  provide layer 4 load balancing for TCP and SSL traffic. While the data-plane used by both these packages is fundamentally the same, the control-plane provided by these packages is vastly different.

### Edge-LB [enterprise type="small"]
Edge-LB can support pools of HAProxy load-balancing instances, allowing for multi-tenant support. It comes with its own CLI to configure and launch pools; it supports not only Marathon applications, but also applications managed by other Mesos frameworks that want to expose their applications to outside the cluster. Edge-LB is available only for DC/OS Enterprise. 

### Marathon-LB
Marathon-LB is much simpler and manages only a single instance of HAProxy. It can load-balance only the applications launched by the Marathon. Marathon-LB is available for both Open Source and Enterprise versions of DC/OS.

## Comparative analysis
While both Marathon-LB and Edge-LB are designed for handling north-south ingress traffic, they can be used for internal east-west layer 7 load-balancing, and even layer 4 east-west load-balancing when necessary. The table below shows a comparative analysis of the different load-balancing solutions present in DC/OS.


|    Solution                        | `dcos-l4lb` | Edge-LB | Marathon-LB |
|-----                               |-----------|---------|---|
| Open Source                        |     X     |         |      X      |
| Enterprise                         |     X     |    X    |      X      |
| North-South (External to Internal) |           |    X    |      X      |
| East-West (Internal to Internal)   |     X     |    X    |      X      |
| Layer 4 (Transport Layer)          |     X     |    X    |      X      |
| Layer 7 (Application Layer)        |           |    X    |      X      |
| Marathon Services                  |     X     |    X    |      X      |
| Non-Marathon Services              |     X     |    X    |             |
| zero-hop load balancing               |     X     |         |             |
| No single point of failure         |     X     |         |             |


# A note on software re-architecture
In DC/OS 1.11 and later, most of the networking components such as `dcos-dns`, `dcos-l4lb`, and `dcos-overlay` are applications that run as part of a single `systemd` unit called `dcos-net`, running on all the nodes of the cluster. Prior to DC/OS 1.11, each of the applications `dcos-dns`, `dcos-l4lb`, and `dcos-overlay` ran as separate `systemd` units. Prior to DC/OS 1.11, the role of `dcos-dns` was fulfilled by `spartan`, `dcos-l4lb` was fulfilled by `minuteman` and `dcos-overlay` was fulfilled by `navstar`. In DC/OS 1.11, the different `systemd` units were aggregated into a single service. The main advantage of following this operational pattern is that it led to more efficient use of resources (lower CPU consumption and lower memory), and also made the networking services a lot more robust. This approach also made it easier to maintain the code.

These updates provide the same or better functionality compared to prior versions of DC/OS, but use resources more efficiently. Thus, even though this software re-architecture has changed the internal machinery for providing networking services within DC/OS, from a functional standpoint you should not see any difference.
