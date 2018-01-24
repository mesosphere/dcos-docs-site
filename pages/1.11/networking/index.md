---
layout: layout.pug
navigationTitle:  Networking
title: Networking
menuWeight: 70
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


The DC/OS network stack provides the following services:

* A standards based API that allows DC/OS to run containers on a variety of different types of IP networks. We refer to this feature in DC/OS as IP-Per-Container.
* A DNS based service discovery mechanism.
* Layer 4 load-balancing for internal (east-west) traffic.
* Layer 7 load-balancing for external (north-south) traffic.

We elaborate more on these features below.

# IP-Per-Container
Allows containers to run on any type of IP-based virtual networks, with each container having its own network namespace.

DC/OS supports IP-per-container for the Universal container runtime (UCR) by using the Container network interface (CNI). DC/OS also supports IP-per-container for the Docker container runtime by using the Container network model (CNM).

## DC/OS overlay
DC/OS provides an out-of-the box virtual networking solution for IP-per-container called DC/OS overlay that works both with UCR and Docker container runtimes. The DC/OS overlay uses the CNI/CNM support in Mesos to provide IP-per-container.For more information, see the [Containerizer documentation](/1.11/deploying-services/containerizers/).

DC/OS overlay is a VxLAN based overlay network. It has distributed control-plane called `dcos-overlay`, that manages subnets, routes and container interfaces on the DC/OS overlay. `dcos-overlay` itself is an Erlang application that runs on each node (agents and masters) as part of the ErLang VM `dcos-net`.

# DNS-Based Service Discovery
DC/OS includes a highly available, distributed, DNS-based service discovery. The service discovery mechanism in DC/OS contains these components:

- A centralized component called Mesos DNS, which runs on every master.
- A distributed component called dcos-dns, that runs as an application with an Erlang VM called dcos-net. The ErLang VM dcos-net runs on every node (agents and masters) in the cluster.

## Mesos DNS
Mesos DNS is a centralized, replicated, DNS server that runs on every master. Every task started by DC/OS gets a well-known DNS name. This provides a replicated highly available DNS service on each of the masters. Every instance of Mesos DNS polls the leading Mesos master and generates a fully qualified domain name (FQDN) for every service running in DC/OS with the domain `*.mesos`.  For more information, see the [Mesos DNS documentation](/1.11/networking/mesos-dns/).

## Local DNS Forwarder (dcos-dns)
*dcos-dns* acts as a DNS masquerade for Mesos DNS on each agent. The dcos-dns instance on each agent is configured to listen to three different local interfaces on the agent and the nameservers on the agent are set to these three interfaces. This allows containers to perform up to three retries on a DNS request. To provide a highly available DNS service, dcos-dns forwards each request it receives to the different Mesos DNS instances which are running on each master.

- Scale-out DNS Server on DC/OS masters with replication.
- DNS server Proxy with links to all Active/Active DNS server daemons.
- DNS server cache service for local services.

The dcos-dns instance on each agent also acts as a DNS server for any service that is load balanced using the DC/OS internal load balancer called [dcos-l4lb](/1.11/networking/load-balancing-vips/). Any service that is load balanced by dcos-l4lb gets a [virtual-ip-address (VIP)](/1.11/networking/mesos-dns/) and an FQDN in the `"*.l4lb.thisdcos.directory"` domain. The FQDN allocated to a load-balanced service is then stored in dcos-dns. All dcos-dns instances exchange the records they have discovered locally from dcos-l4lb by using GOSSIP. This provides a highly available distributed DNS service for any task that is load balanced by Minuteman. For more information, see the [dcos-net repository](https://github.com/dcos/dcos-net/blob/master/docs/dcos_dns.md).

# Load Balancing

DC/OS offers different options for layer-4 and layer 7 load balancing. We describe the various features provided, in terms of load-balancing, at both these layers in the following sections.
[Edge-LB](/pages/services/edge-lb),
and [Marathon-LB](/pages/services/marathon-lb).

## Layer 4
*[dcos-l4lb](/1.11/networking/load-balancing-vips/)* is a distributed layer 4 east-west load balancer that is installed by default. 
It's highly scalable and highly available, offering 0 hop load balancing, no single choke point,
and tolerance to host failures. 

dcos-l4lb runs as an application within the Erlang VM *dcos-net* which runs on all agents and masters within the cluster.


## Layer 7
There are two packages within DC/OS that provide layer 7 load-balancing for DC/OS services. Edge-LB and Marathon-LB, both these packages use HAPRoxy as its data-plane for providing layer 7 load-balancing for north-south traffic ingressing into the cluster. Both these packages provide load balancing for TCP and HTTP-based applications, SSL support, and health checking. 

While the data-plane used by both these packages is fundamentally the same, the control-plane provided by these packages are vastly different. Edge-lb is the more recent of the two and is richer in its featureset compared to Marathon-LB. Edge-LB has the ability to support pools of HAProxy load-balancing instances, allowing for a multi-tenant support . It comes with it own CLI to configure and launch pools, and supports not only Marathon tasks, but also tasks managed by custom Mesos framesworks that want to expose their tasks outside the cluster. 

Marathon-LB is a much simpler version of Edge-LB and manages a single instance of HAProxy. It also can load-balance only Marathon tasks and cannot be used to load-balance tasks launch by custom frameworks that are not visible to Marathon.

Edge-LB is available only for DC/OS Enterprise and currently does not work on Open DC/OS, while Marathon-LB is available for open as well as enterprise versions of DC/OS.

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



# A note on software re-architecture
In DC/OS 1.11 most of the networking components such `dcos-dns`, `dcos-l4lb`, `dcos-overlay`, are ErLang applications that run as part of a single ErLang VM called `dcos-net`. `dcos-net` is itself a systemD unit that runs on all nodes in the cluster. It is important to note that prior to DC/OS 1.11 each of the applications `dcos-dns`, `dcos-l4lb`, and `dcos-overlay` were running their own ErLang VM, with their own repositories. Prior to DC/OS 1.11 role of `dcos-dns` was fulfilled by `spartan`, `dcos-l4lb` was fulfilled by `minuteman` and `dcos-overlay` was fulfilled by `navstar`. In DC/OS 1.11 we decided to aggregate all these different ErLang VMs into a single ErLang VM, primarily because this is more idiomatic to the way ErLang applications are supposed to run. This is lead better efficiency in terms of resource utilization (lower CPU consumption and higher throughput) and also makes the service a lot more robust and reliable. It's important to note that from a functionality perspective DC/OS 1.11 provides exactly the same, or better functionality, when compared to prior versions of DC/OS, except with better efficieny in terms of resource utilization.



