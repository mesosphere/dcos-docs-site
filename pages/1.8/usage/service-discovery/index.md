---
layout: layout.pug
navigationTitle:  Service Discovery and Load Balancing
title: Service Discovery and Load Balancing
menuWeight: 60
excerpt:
enterprise: false
featureMaturity:
---

DC/OS provides a number of tools out of the box for service discovery and load balancing. Here's an overview of the options, with some general guidelines on what to use in which situations.

| Tool | Type | When should I use it? |
|----------------------------|-------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [VIPs][1] ([Minuteman][2]) | A layer 4 load balancer, which can be used for most TCP traffic for any Mesos task within a DC/OS cluster. | When you have internal-only TCP services which do not require layer 7 features. |
| [Marathon-LB][3] | Marathon-LB is an HAProxy based load balancer for Marathon only. | When you require external routing or layer 7 load balancing features. Examples of layer 7 features include: TLS termination, zero-downtime deployments, HTTP sticky sessions, load balancing algorithm customization, network ACLs, HTTP basic auth, gzip compression, and more. |
| [Mesos-DNS][4] | Mesos-DNS is a basic DNS-based service discovery tool that works with any Mesos task. | When VIPs or Marathon-LB are not adequate, you can use the auto-generated [Mesos-DNS names][5]. For example, to discover Marathon-LB you'd use Mesos-DNS by connecting to Marathon-LB with `marathon-lb.marathon.mesos`. Or, if you have UDP services such as StatsD. |

[1]: /1.8/usage/service-discovery/load-balancing-vips/virtual-ip-addresses/
[2]: /1.8/usage/service-discovery/load-balancing-vips/
[3]: /1.8/usage/service-discovery/marathon-lb/
[4]: /1.8/usage/service-discovery/mesos-dns/
[5]: /1.8/usage/service-discovery/mesos-dns/service-naming/#dns-naming
[6]: /1.8/usage/service-discovery/third-party-solution/
