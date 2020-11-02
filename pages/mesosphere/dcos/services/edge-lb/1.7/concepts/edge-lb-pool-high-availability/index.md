---
layout: layout.pug
navigationTitle: Edge-LB pools for high-availability
title: Edge-LB pools for high-availability
menuWeight: 15
excerpt: Describes how to use multiple Edge-LB instances to support high-availability for services
enterprise: false
---

Edge-LB uses its pools to provide high availability in two key ways:

- If an existing Edge-LB pool instance goes down on a healthy agent node, the Edge-LB server creates a replacement pool instance on the same agent and continues to satisfy all requests without any user intervention.

- If an existing Edge-LB pool instance goes down because an agent node becomes unavailable, the Edge-LB server creates new Edge-LB pool instances on a different agent and starts routing traffic to the new pool instance.

# Using app-specific pool instances

By deploying dedicated Edge-LB pools per application or framework, you can ensure that any failure is restricted to a single load-balancer instance and application combination. This segregation helps to ensure that application performance is not affected and that application resource requirements are isolated from each other. Instead of competing for the same resources, load balanced application pools can remain independent from each other.

The following diagram provides an example of this type of application-specific Edge-LB pool usage:

<p>
<img src="/mesosphere/dcos/services/edge-lb/1.7/img/Edge-LB-app-pool-arch.png" alt="Using multiple Edge-LB pool instances">
</p>

This diagram illustrates Edge-LB pool instances with each pool instance deployed for a single service. If the Edge-LB pool instance that handles load balancing for MySQL&reg; goes down, Edge-LB continues to load balance traffic for NGINX&trade; pool instances.

# Using multiple public agent nodes

One of the key ways you can ensure high availability for load balanced applications is by deploying Edge-LB on more than one public agent in the DC/OS&trade; cluster. Deploying Edge-LB on multiple public agents provides additional flexibility for how you route traffic to different pool instances in a production cluster, and helps to minimize the likelihood of service interruptions if a pool goes down.

# Automatic scaling based on resource consumption

Edge-LB templates also contribute to high availability by automatically configuring the load balancer to adjust as applications scale up and scale down using DC/OS application-aware scheduling.

When an application scales up to consume more resources, such as expanding to additional tasks and nodes, Edge-LB can automatically react by including the new application tasks into the backend of the load balancer pool. Because Edge-LB manages these changes without user intervention, it enables DC/OS to provide elastic scaling for applications running on the platform.

Multiple Edge-LB pools can be configured across multiple DC/OS public nodes to create a highly-available load balancing environment and to support increased throughput.
