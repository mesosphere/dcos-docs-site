---
layout: layout.pug
navigationTitle: Edge-LB concepts
title: Edge-LB concepts
menuWeight: 5
excerpt: Edge-LB provides load balancing for services that run on DC/OS Enterprise clusters

enterprise: true
---
At its core, Edge-LB provides secure communication, load balancing, and workload distribution for external client requests wanting access to services running inside of DC/OS clusters. The application name, node, and port define the **frontend** for the inbound request. The load balancer applies its configuration rules and routes the inbound traffic to the appropriate **backend** servers that are configured to respond to the service request.

This type of **external-to-internal** or **North-South** load balancing is the most common scenario. However, you can also use Edge-LB for load balancing and workload distribution when both the clients requesting access and the services available are both running inside of the DC/OS cluster. This type of **internal-only** or **East-West** load balancing is most often managed through the DC/OS networking layer (`dcos-net`) by the distributed layer-4 load balancer `dcos-l4lb` (previously known as Minuteman). Edge-LB augments the native layer-4 load balancer by providing layer-7 load balancing for internal traffic and granular control over how traffic is routed for all inbound requests whether they originate inside or outside of the DC/OS cluster. For more information about the network stack and using the native layer-4 load balancer, see [load balancing](/1.13/networking/#load-balancing).

<!--To handle its load balancing and distribution duties, Edge-LB leverages features and configuration options supported by `HAProxy`. `HAProxy` is an open-source project that provides:
- Load balancing for TCP and HTTP-based applications
- Secure communication through encrypted SSL certificates from external clients to the edge of the cluster, to application containers, or to individual application instances.
- Logging and health checking related to load balancing operations. 
- API support for scripted operations or automation.

Edge-LB also supports zero-downtime service deployment strategies. Zero-downtime deployment strategies enable organizations to make service changes -- for example, to handle an application upgrade or to roll back to the previous version -- in a phased approach that minimizes the potential for service interruption rather than all at once. This type of phased deployment or application rollout is sometimes referred to as a **blue/green deployment**. -->
