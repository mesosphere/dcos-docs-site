---
layout: layout.pug
navigationTitle: Edge-LB concepts
title: Edge-LB concepts
menuWeight: 5
excerpt: Edge-LB proxies and load balances traffic for services that run on DC/OS Enterprise clusters
enterprise: true
---

For most organizations, Edge-LB provides load balancing and workload distribution for external client requests wanting access to services running inside of the cluster. The application name, node, and port define the **frontend** for the inbound request. The load balancer applies its configuration rules and routes the inbound traffic to the appropriate **backend** servers that are configured to respond to the service request.

Although this type of **external-to-internal** or **North-South** load balancing is the most common scenario, you can also use Edge-LB for load balancing and workload distribution when both the clients requesting access and the services available are both running inside of the DC/OS cluster. This type of **internal-only** or **East-West** load balancing is most often managed through the DC/OS networking layer (`dcos-net`) by the distributed layer-4 load balancer `dcos-l4lb` (previously known as Minuteman). For more information about the network stack and using the native layer-4 load balancer, see [load balancing](/1.13/networking/#load-balancing).

Edge-LB augments the native layer-4 load balancer by providing layer-7 load balancing for internal traffic and granular control over how traffic is routed for all inbound requests whether they originate inside or outside of the DC/OS cluster.

To handle its load balancing and distribution duties, Edge-LB leverages `HAProxy` features and configuration options. `HAProxy` is an open-source project that provides:
- Load balancing for TCP and HTTP-based applications
Secure communication through encrypted SSL certificates from external clients to the edge of the cluster, to application containers, or to individual application instances.
- Logging and health checking related to load balancing operations. 
- API support for scripted operations or automation.

Edge-LB also supports zero-downtime service deployment strategies. Zero-downtime deployment strategies enable organizations to make service changes -- for example, to handle an application upgrade or to roll back to the previous version -- in a phased approach that minimizes the potential for service interruption rather than all at once. This type of phased deployment or application rollout is sometimes referred to as a **blue/green deployment**.

<!--One of the most important ways you can manage cluster operations is through efficient load balancing of access requests and workload processing. Load balancing improves the performance, reliability, and network efficiency for web-nased properties, applications, databases, and other services by distributing workload across multiple servers.

Without load balancing, users or clients attempting to access a service can be blocked by server failures, network downtime, system overload, or too many simultaneous processing requests. You can mitigate these potential problems by introducing a load balancer and additional nodes on the backend to handle the demand. 

Conceptually, the load balancer provides a network communication layer for distributing client requests to applications. The load balancer is configured to accept the inbound requests for access to application services. The application name, node, and port define the **frontend** for the inbound request. The load balancer routes the inbound traffic to the appropriate **backend** servers that are configured to respond to the service request.

