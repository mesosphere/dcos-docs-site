---
layout: layout.pug
navigationTitle: Edge-LB
title: Edge-LB
menuWeight: 20
excerpt: Edge-LB proxies and load balances traffic to all services that run on DC/OS.
enterprise: true
---
You can use Edge-LB to proxy and load balance traffic to all services that run on a DC/OS Enterprise cluster. For most organizations, Edge-LB provides enterprise-grade load balancing and workload distribution for external client requests wanting access to services running inside of the cluster. 

Although this type of **external-to-internal** or **North-South** load balancing is the most common scenario, you can also use Edge-LB for load balancing and workload distribution when both the clients requesting access and the services available are both running inside of the DC/OS cluster. This type of **internal-only** or **East-West** load balancing is most often managed through the DC/OS networking layer (`dcos-net`) by the distributed layer-4 load balancer `dcos-l4lb` (previously known as Minuteman). 

Edge-LB augments the native layer-4 load balancer by providing layer-7 load balancing for internal traffic and granular control over how traffic is routed for all inbound requests whether they originate inside or outside of the DC/OS cluster.

To handle its load balancing and distribution duties, Edge-LB leverages `HAProxy` features and configuration options. `HAProxy` is an open-source project that provides:
- Load balancing for TCP and HTTP-based applications
Secure communication through encrypted SSL certificates from external clients to the edge of the cluster, to application containers, or to individual application instances.
- Logging and health checking related to load balancing operations. 
- API support for scripted operations or automation.

Edge-LB also supports zero-downtime service deployment strategies. Zero-downtime deployment strategies enable organizations to make service changes -- for example, to handle an application upgrade or to roll back to the previous version -- in a phased approach that minimizes the potential for service interruption rather than all at once. This type of phased deployment or application rollout is sometimes referred to as a **blue/green deployment**.

If you are a new user deploying Edge-LB for the first time, you should get the latest version of the package and take an introductory tour using the [Getting started](/services/edge-lb/getting-started/) topics. If you are familiar with Edge-LB but need help installing, configuring, or troubleshooting an Edge-LB deployment, get the latest version of the package available, then review the concepts, tutorials, and reference information to get the most from your deployment.
