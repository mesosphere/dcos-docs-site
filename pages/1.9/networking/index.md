---
layout: layout.pug
navigationTitle:  Networking
title: Networking
menuWeight: 70
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


DC/OS provides a number of tools out-of-the-box, ranging from basic network connectivity between containers to more advanced features, such as load balancing and service discovery.

# IP Per Container
Allows containers to run on any type of IP-based virtual networks, with each container having its own network namespace.

DC/OS supports IP per container for the Universal container runtime (UCR) by using the Container network interface (CNI). DC/OS supports IP per container for the Docker container runtime by using the Container network model (CNM).

DC/OS provides an out-of-the box virtual networking solution for IP per container called DC/OS overlay that works both with UCR and Docker container runtimes. The DC/OS overlay uses the CNI/CNM support in Mesos to provide IP per container.For more information, see the [Containerizer documentation](/1.9/deploying-services/containerizers/).

# DNS-Based Service Discovery
DC/OS includes highly available, distributed, DNS-based service discovery. The service discovery mechanism in DC/OS contains these components:

- A centralized component called Mesos DNS, which runs on every master.
- A distributed component called Spartan that runs on every agent.

## Mesos DNS
Mesos DNS is a centralized, replicated, DNS server that runs on every master. Every task started by DC/OS gets a well-known DNS name. This provides a replicated highly available DNS service on each of the masters. Every instance of Mesos DNS polls the leading Mesos master and generates a fully qualified domain name (FQDN) for every service running in DC/OS with the domain `*.mesos`.  For more information, see the [Mesos DNS documentation](/1.9/networking/mesos-dns/).

## DNS Forwarder (Spartan)
Spartan acts as a DNS masquerade for Mesos DNS on each agent.

The Spartan instance on each agent is configured to listen to three different local interfaces: `198.51.100.1`, `198.51.100.2`, and `198.51.100.3`. The `nameserver` option in the `/etc/resolv.conf` on the agent is set to these three interfaces.

This allows containers to perform up to three retries on a DNS request. To provide a highly available DNS service, Spartan forwards each request it receives to the different Mesos DNS instances which are running on each master.

- Scale-out DNS Server on DC/OS masters with replication.
- DNS server Proxy with links to all Active/Active DNS server daemons.
- DNS server cache service for local services.


The Spartan instance on each agent also acts as a DNS server for any service that is load balanced using the DC/OS internal load balancer called [Minuteman](/1.9/networking/mesos-dns/). Any service that is load balanced by Minuteman gets a [virtual-ip-address (VIP)](/1.9/networking/mesos-dns/) and an FQDN in the `"*.l4lb.thisdcos.directory"` domain. The FQDN allocated to a load-balanced service is then stored in Spartan. All Spartans instances exchange the records they have discovered locally from Minuteman by using GOSSIP. This provides a highly available distributed DNS service for any task that is load balanced by Minuteman. For more information, see the [Spartan repository](https://github.com/dcos/spartan).

# Load Balancing
East-west load balancing is provided by Minuteman. North-south load balancing is provided by [Marathon LB](/services/marathon-lb/1.12/). Marathon-LB is based on HAProxy, a rapid proxy and load balancer. It is installed as a DC/OS Universe package.

## Minuteman
Minuteman is a distributed layer 4 virtual IP east-west load balancer that is installed by default. It provides:

- Distributed load balancing of applications.
- Highly available LB with no single choke point.
- Highly scalable and tolerant to large number of host failures.


## Marathon LB
Marathon LB is based on HAProxy, a rapid proxy and north-south load balancer. HAProxy provides proxying and load balancing for TCP and HTTP based applications, with features such as SSL support, HTTP compression, health checking, Lua scripting and more. Marathon LB subscribes to Marathon’s event bus and updates the HAProxy configuration in real time. Here are common Marathon LB use cases:

- Use Marathon LB as your edge load balancer (LB).
- Use Marathon LB as an internal LB and service discovery mechanism, with a separate HA load balancer for routing public traffic.
