---
layout: layout.pug
navigationTitle:  Version support
title: Version support
menuWeight: 102
excerpt: Summarizes supported versions for Edge-LB
enterprise: true
---

Edge-LB is a layer-7 load balancer for TCP, HTTP, and HTTPS requests optimized to work with DC/OS Enterprise clusters. Edge-LB leverages many of the basic features provided by  the `HAProxy` open-source project, including:
- high-availability
- failover support
- load balancing
- server health checks
- throughput and activity metrics

Although Edge-LB relies on some core functionality provided by HAProxy, it is released as a separate pacakge on a regular schedule to provide updates and bug fixes optimized for working with DC/OS clusters. In general, you should always install the latest version of Edge-LB available that supports the DC/OS release you have deployed. 

Here is the current Edge-LB support matrix: 
| Edge-LB version | DC/OS Enterprise version |
|------------------|-------------------------|
| Edge-LB 1.3.1    | DC/OS 1.12.2            |
| Edge-LB 1.3.0    | DC/OS 1.11.9            |
| Edge-LB 1.2.3    | DC/OS 1.10.10           |

For more complete and detailed information about DC/OS versions and compatibility requirements, see the DC/OS [version support policy](/version-policy/).