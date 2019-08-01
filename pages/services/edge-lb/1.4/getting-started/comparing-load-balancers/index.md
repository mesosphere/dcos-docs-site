---
layout: layout.pug
navigationTitle: Comparing load balancers
title: Comparing load balancing services
menuWeight: 15
excerpt: Summarizes the differences between Marathon-LB and Edge-LB load balancing services
enterprise: true
---
Marathon-LB is the predecessor of Edge-LB. With Marathon-LB, a single container for the load balancer service manages all activity, including:
- Generating and reloading configuration files.
- Distributing inbound traffic.
- Monitoring the load balancer health. 

Edge-LB provides similar capabilities, enabling you to load-balance traffic from internet-facing applications attempting to access services that run inside of the DC/OS Enterprise cluster. However, Edge-LB offers additional benefits through a more scalable architecture that supports:
- High-availability with robust failover recovery and fault tolerance through load balancing pools.
- Fine-grain configuration and validation for operational efficiency with less administrative overhead.
- Advanced deployment, distribution, and configuration options for flexibility and control over how inbound traffic reaches its destination within the DC/OS cluster.

# Distributing the workload for supported services
Marathon-LB can only handle load-balancing for services that are defined and run using the Marathon framework. Marathon-LB cannot distribute processing for any other services. For example, Maratho-LB cannot handle load balancing for services that run as Mesos tasks or as task executors. Marathon-LB does not recognize services that are not defined or run as Marathon-based services. Instead, Marathon-LB listens for traffic through the Marathon event stream service bus and is therefore limited to exposing and distributing access requests to Marathon-based apps.

Unlike Marathon-LB, Edge-LB can expose and distributing access requests to any services running on the DC/OS Enterprise cluster. Edge-LB supports load balancing for all DC/OS workloads, including the tasks associated with Mesos frameworks and with other data services. 

As the DC/OS cluster ecosystem extends beyond Marathon-based apps. Edge-LB enables you to broaden your load balancing coverage to handle inbound requests for apps based on other data services such as Cassandra and Kafka. Similarly, Edge-LB enables you to extend load balancing support to access requests for services deployed on Kubernetes-based clusters running with Mesosphere automation. 

Because Edge-LB is built as a DC/OS framework, it can leverage the same DC/OS SDK that all of your production data services are using. This means that you get the same reliability and platform integration that your mission critical databases and analytics applications are using. With the DC/OS SDK as its foundation, Edge-LB can seamlessly incorporate new features as DC/OS expands.

# Using app labels or task names for load balancing
Marathon-LB relies on template-based overrides and application labels to configure load balancing settings. The labels, which are typically specified in app definition files, allow different users to configure the same setting with different values for different applications. 

While using the same label with different values or configure settings for different applications can be appropriate for some scenarios, it is possible for you to have two completely different applications using the same label for the same Marathon-LB configuration instance, resulting in an unintended configuration conflict.

Edge-LB removes this potential for misconfiguration. Mesos task names are used instead of labels as the primary mechanism for determining what to load balance. With Edge-LB, you must explicitly define the tasks that you want to load balance. This explicit definition ensures uniqueness, since Marathon and other frameworks enforce unique task names.

# Validation and fault tolerance
Edge-LB does some basic configuration validation before deploying. Marathon-LB only validates configuration settings during its installation. The same is true for configuration changes. With Edge-LB, you can reload the configuration settings at any time without any service disruptions. With Maration-LB, changing the load balancing configuration requires reinstalling the load balancer, which is often a manual, error-prone, or time-consuimng process. 

From a deployment standpoint, Edge-LB enables you to develop a load-balancing template which can be validated by Edge-LB without service disruption, then modify and refine the template as the platform and your load-balancing requirements evolve.

Edge-LB provides high availability and fault tolerance with multiple pool instances. With Marathon-LB, an invalid configuration setting can take down whole cluster causing network outages.

# Support for container network standards
Edge-LB supports network components that use the industry-standard container network interface (CNI). By supporting this industry standard, Edge-LB provides you with deployment and load-balancing strategy options that are not available when using Marathon-LB.

# Benefits of Edge-LB over Marathon-LB at-a-glance
The key benefits of the load balancing provided by Edge-LB over those provided by Marathon-LB are: 
- Edge-LB supports all applications, services, and workloads that you deploy in the DC/OS Enterprise cluster, not just Marathon-based apps.
-	Edge-LB enables you to define multiple Edge-LB pool instances and multiple Edge-LB pools for more granular control and high availability.
-	Edge-LB provides better configuration validation before, during, and after installation.

To see the difference between loading balancing using Marathon-LB and Edge-LB for access to services in the cluster, see [Comparing Edge-LB to Marathon-LB](/mesosphere/dcos/services/edge-lb/1.4/getting-started/edge-lb-mlb-example/).
