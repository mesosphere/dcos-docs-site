---
layout: layout.pug
navigationTitle:  Marathon-LB
title: Marathon-LB
menuWeight: 80
excerpt: Marathon-LB is a load balancing service for TCP, HTTP, and HTTPS requests
enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->

Marathon provides a meta-framework for scheduling, container orchestration, and load balancing as part of the Mesosphere DC/OS platform. Marathon load balancer (Marathon-LB) is a proxy server and load balancer for TCP, HTTP, and HTTPS requests based on `HAProxy` open-source software. 

You can configure Marathon-LB with various topologies. Here are some examples of how you might use Marathon-LB:

* Use Marathon-LB as your edge load balancer running on public-facing nodes to route inbound traffic. In this scenario, Marathon-LB uses the DNS service address (A) records of public-facing nodes to route internal or external acccess requests to application instances.

* Use Marathon-LB as an internal load balancer with a separate load balancer for routing public traffic. For example, in this scenario, you might use an external F5 load balancer on-premise or an Elastic Load Balancer on Amazon Web Services to route public traffic.

* Use Marathon-LB strictly as an internal load balancer without providing load balancing for any public-facing traffic.

* Use Marathon-LB instances in a combination of internal and external load balancers, with different services exposed on different load balancers.
