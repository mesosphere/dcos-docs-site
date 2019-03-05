---
layout: layout.pug
navigationTitle: Edge-LB concepts
title: Edge-LB concepts
menuWeight: 5
excerpt: Edge-LB proxies and load balances traffic to all services that run on DC/OS.
enterprise: true
---

One of the most important ways you can manage cluster operations is through efficient load balancing of access requests and workload processing. Load balancing improves the performance, reliability, and network efficiency for web-nased properties, applications, databases, and other services by distributing workload across multiple servers.

Without load balancing, users or clients attempting to access a service can be blocked by server failures, network downtime, system overload, or too many simultaneous processing requests. You can mitigate these potential problems by introducing a load balancer and additional nodes on the backend to handle the demand. 

Conceptually, the load balancer provides a network communication layer for distributing client requests to applications. The load balancer is configured to accept the inbound requests for access to application services. The application name, node, and port define the **frontend** for the inbound request. The load balancer routes the inbound traffic to the appropriate **backend** servers that are configured to respond to the service request.
