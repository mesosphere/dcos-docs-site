---
layout: layout.pug
navigationTitle: Edge-LB pools for high-availability
title: Edge-LB pools for high-availability
menuWeight: 15
excerpt: Describes how to use multiple Edge-LB instances to support high-availability for services
enterprise: true
---

Multiple Edge-LB pools can be configured across multiple DC/OS public nodes to create a highly-available load balancing environment and to support increased throughput. There are two primary external architectures that support this:

- External Load Balancer: Configures multiple Edge-LB pools such that the Edge-LB load balancers that are on DC/OS public nodes are behind an external load balancer. Direct end users or clients to the external load balancer device, which will then load balance the traffic between the multiple Edge-LB pools. The external load balancer can be a cloud-based load balancer, such as an AWS Elastic Load Balancer (ELB), an Azure Load Balancer, or a physical load balancer such as an F5 or Cisco ACE device.

- Round Robin DNS: Configures DNS such that a single DNS entry responds with IP addresses corresponding to a different Edge-LB pool. The DNS will round robin between the VIPs for each Edge-LB pool.

The following diagram illustrates multiple load balancers in an Edge-LB pool distributing requests to services running on a DC/OS cluster.

<p>
<img src="/services/edge-lb/img/Edge-LB-3.png" alt="Using multiple Edge-LB load balancers in a pool">
</p>

Edge-LB further reduces the chances of misconfiguration by validating the configuration prior to each deployment, compared to Marathon LB’s validation at installation. This configuration validation is built upon Edge-LB’s ability to perform configuration reloads without any disruption.

If an instance within an Edge-LB pool does have an issue, for example, the server it is on has a hardware fault, Edge-LB can automatically spin up another Edge-LB instance, healing the pool and continuing to satisfy requests, all without user intervention.

With a multi-user system like DC/OS, user-created resource conflicts could be devastating, yet we can prevent them completely using Edge-LB.

The Edge-LB Pool is a group of identically configured load balancers. Traffic to the pool is balanced among the load balancers within the pool. The load balancer pool manages properties such as the number of load balancer instances and their placement. The pool is the smallest unit of load balancer configuration within Edge-LB. The load balancers within the same pool are identical. You can configure Edge-LB to have multiple load balancer pools with different configurations.

Multiple Edge-LB pools can be configured across multiple DC/OS public nodes to create a highly-available load balancing environment and to support increased throughput. There are two primary external architectures that support this:

By deploying dedicated Edge-LB pools per application or framework, you can not only ensure that failure domains remain restricted to a single load-balancer instance/application, but that performance is preserved because applications that require increasing resources remain independent from other applications.

<!--External Load Balancer: Configures multiple Edge-LB pools such that the Edge-LB load balancers that are on DC/OS public nodes are behind an external load balancer. Direct end users or clients to the external load balancer device, which will then load balance the traffic between the multiple Edge-LB pools. The external load balancer can be a cloud-based load balancer, such as an AWS Elastic Load Balancer (ELB), an Azure Load Balancer, or a physical load balancer such as an F5 or Cisco ACE device.
Round Robin DNS: Configures DNS such that a single DNS entry responds with IP addresses corresponding to a different Edge-LB pool. The DNS will round robin between the VIPs for each Edge-LB pool. -->

Edge-LB's templates make it possible to update, scale, and automatically recover applications without disrupting traffic to and from the outside world.

Edge-LB templates also contribute to high availability by automatically configuring the load balancer as applications scale up and down using DC/OS application-aware scheduling.  When an application scales to consume more resources, such as expanding to additional tasks and nodes, Edge-LB can automatically react and automatically include the new application tasks into the backend of the load balancer pool. The combination of application-aware scheduling and Edge-LB accomplishes this without user intervention, allowing DC/OS to provide a high availability elastically scaling platform for applications.
