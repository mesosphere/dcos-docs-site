---
layout: layout.pug
navigationTitle: Edge-LB pools for high-availability
title: Edge-LB pools for high-availability
menuWeight: 15
excerpt: Describes how to use multiple Edge-LB instances to support high-availability for services
enterprise: true
---
Edge-LB provides high availability by design. If an existing Edge-LB pool instance goes down, it heals itself by respawning the pool instance in the same agent and continues to satisfy all requests without any user intervention as long as the agent node is still available. If the agent node is not available, Edge-LB respawns the Edge-LB pool instances on a different agent and starts routing traffic to the new pool instance.

By deploying dedicated Edge-LB pools per application or framework, you can ensure that failure domains remain restricted to a single load-balancer instance/application, and that performance is preserved because applications that require increasing resources remain independent from other applications.

The following diagram provides an example of Edge-LB's high availability:

<p>
<img src="/services/edge-lb/img/Edge-LB-3.png" alt="Using multiple Edge-LB load balancers in a pool">
</p>

The above diagram demonstrates 10 Edge-LB pool instances. Each pool instance is deployed for a single DC/OS service. Thus if Edge-LB pool instance `3` goes down, Edge-LB will continue to load balance traffic for rest of the 9 pool instances.

Another best practice to achieve high availability with Edge-LB is to deploy more than one public agent in the DC/OS cluster. You can deploy and spread the pool instances across the DC/OS cluster to have minimal impact on service if a pool goes down.

Edge-LB templates also contribute to high availability by automatically configuring the load balancer as applications scale up and down using DC/OS application-aware scheduling. When an application scales to consume more resources, such as expanding to additional tasks and nodes, Edge-LB can automatically react and automatically include the new application tasks into the backend of the load balancer pool. The combination of application-aware scheduling and Edge-LB accomplishes this without user intervention, allowing DC/OS to provide a high-availability elastically-scaling platform for applications.

Multiple Edge-LB pools can be configured across multiple DC/OS public nodes to create a highly-available load balancing environment and to support increased throughput. 

There are two primary external architectures that support this:
- External load balancer: Configures multiple Edge-LB pools such that the Edge-LB load balancers that are on DC/OS public nodes are behind an external load balancer. Direct end users or clients to the external load balancer device, which will then load balance the traffic between the multiple Edge-LB pools. The external load balancer can be a cloud-based load balancer, such as an AWS Elastic Load Balancer (ELB), an Azure Load Balancer, or a physical load balancer such as an F5 or Cisco ACE device.

- Round robin DNS: Configures DNS such that a single DNS entry responds with IP addresses corresponding to a different Edge-LB pool. The DNS will round robin between the virtual IP addresses for each Edge-LB pool.
