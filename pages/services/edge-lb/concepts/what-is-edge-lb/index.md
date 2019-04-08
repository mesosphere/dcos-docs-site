---
layout: layout.pug
navigationTitle: What is Edge-LB?
title: What is Edge-LB?
menuWeight: 5
excerpt: Introduces the high-level capability that Edge-LB provides
enterprise: true
---
Edge-LB (Load Balancer) is an highly available, fault tolerant, health-aware, and scalable North-South load-balancer for internet-facing Layer-7 traffic ingressing into the DC/OS cluster. It proxies and load balances traffic to all services running on the cluster. It provides the functionality to load balance traffic for TCP, HTTP-based application, SSL support, and health-checking. 

Edge-LB provides an integrated load balancing solution for your stateful and stateless workloads. Its platform awareness, configurability, and scalability will simplify your development. It enables DC/OS operators and users to build applications and frameworks that make full use of the DC/OS platform. Customers can expose their applications that include custom frameworks using the customizable Edge-LB.

Edge-LB provides ingress for internet-facing traffic to the DC/OS cluster for not only Marathon-based apps, but all other apps and data services deployed using the DC/OS SDK, including Cassandra, Kafka, and Spark. This allows the operator greater flexibility for operating the DC/OS cluster for L7 traffic.

Edge-LB addresses the challenge of exposing contained apps within the cluster to the outside world. It is available in all three interfaces of CLI, GUI, and API of your choice. You can install the Edge-LB from the GUI, then can deploy load-balancing configuration through DC/OS CLI client. Edge-LB is integrated with DC/OS Secret store for secure certificate usage and storage. Application developers can leverage the built-in support for security in DC/OS when they are deploying their applications. It provides advanced configuration options to expose applications for high performance and high availability environments.

The load balancer increases the availability of the applications. An operator can have multiple pool instances for high availability of the applications running on DC/OS cluster. The pool instances can be added or removed depending on the need. You can scale up and down depending on the deployment scenarios. You can select specific ports for frontend and backend connections for maximum flexibility or allow frontend and backend ports to be assigned dynamically.

Edge-LB pool is health-aware. You can configure health-checks to monitor the health of the Edge-LB pool instances. This ensures all traffics are routed to the healthy Edge-LB pools.

There is no restriction of using Edge-LB with other load balancers as well. You can achieve high availability by placing a hardware or public cloud load balancer in front of Edge-LB for routing internet-facing traffic into the cluster. For example, you can use an external F5 load balancer on-premise, or an Elastic load balancer (ELB) on Amazon Web Services. The following diagram illustrates a high-availability load balancer configuration with an external hardware load balancer placed in front of Edge-LB:

<p>
<img src="/services/edge-lb/img/Edge-LB-1.png" alt="Simplified overview of Edge-LB architecture">
<p>

Using an external load balancer in conjunction with Edge-LB is optional, but can improve the overall fault tolerance for the DC/OS cluster.

Edge-LB is particularly well-suited to work with the Mesos framework that is schedule-aware. It is integrated with Mesos and has the ability to load balance any service running on DC/OS. It provides much more flexibility in terms on configuration management with advanced configuration flexible.

Some benefits of Edge-LB are:
- Proxies and load balances layer-7 traffic ingressing into DC/OS cluster.
- Clients and applications can easily expose and access load-balanced all DC/OS services through Edge-LB.
- It works for all services running on DC/OS cluster not just Marathon-based apps.
- Edge-LB pools are health-aware.
- Operators can create pools of load balancers with high availability for services.
	
Leveraging DC/OS’s support for CNI (Container Network Interface), Edge-LB builds upon this industry standard model to enable the load balancer instances to reside on CNI-based networks and be further decoupled from the transport layer underneath.

While Edge-LB provides North-South load balancing, if you are interested in East-West (internal to internal) load balancing in the DC/OS cluster, you can use the DC/OS layer-4 load balancer [`dcos-l4lb`](/1.13/networking/#load-balancing).
