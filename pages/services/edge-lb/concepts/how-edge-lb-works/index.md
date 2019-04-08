---
layout: layout.pug
navigationTitle: How Edge-LB works
title: How Edge-LB works
menuWeight: 10
excerpt: Highlights the basic workflow and key components for Edge-LB operations
enterprise: true
---
Edge-LB is a powerful load balancer with a simplified design that is built to handle a distributed architecture with robust functionality and stellar performance. Edge-LB provides core load balancing and proxying features, such as load balancing for TCP and HTTP-based applications, SSL support, and health checking. It provides first class support for zero-downtime service deployment strategies like blue/green deployment. 

Edge-LB is usually deployed on the public nodes for increased security. Public nodes are in demilitarized zones (DMZ) or perimeter networks of the DC/OS cluster. Multiple public nodes are recommended for high availability for traffic ingressing in the cluster. Operators can deploy individual pool instances specific to tenants or group of applications. It is designed to scale and provide granular control. 

In the diagram below, a CLI client accesses Edge-LB through the API server. After the client submits a request for the Edge-LB pool creation, the API server launches a Edge-LB pool by deploying the pool configuration file. The internet-facing traffic ingress into the cluster and the pool instance load balances the traffic to the proper backend service instances.

The following diagram provides a simplified architectural view of Edge-LB:

<p>
<img src="/services/edge-lb/img/Edge-LB-2.png" alt="Core components of the Edge-LB architecture">
</p>

# Basic workflow
This diagram illustrates the basic workflow for Edge-LB operations that can be summarized as: 
- Deploy a service on DC/OS cluster.
- Install an Edge-LB API server.
- Deploy an Edge-LB pool instance to expose and access the service.

In the event of the update, you simply update the pool configuration and deploy the updated Edge-LB pool configuration to reflect the changes.

# Key Edge-LB components
Edge-LB has two core components that provide the proxying and load-balancing functionality for inbound traffic to the DC/OS cluster:
- Edge-LB API server
- Edge-LB pool

Both Edge-LB API server and the pool server run as a Marathon service on the DC/OS cluster. 

## Edge-LB API server

The API server presents an API to submit configurations to the Edge-LB pool and handles the generation of the configuration file. The API server executes requests from the CLI client to manage the pools in the cluster. 

The API server provides two functionalities for the traffic ingressing into the cluster:
- Performs create, read, update, and delete (CRUD) actions on Edge-LB pool(s)
- Responds to Edge-LB pool-related API endpoints queries

The API server stores the pool configuration in a configuration management systems (CMS). When you deploy the Edge-LB pool, the API server saves a copy of the pool configuration file in CMS. When the configuration is updated, the API server updates the configuration file in the CMS and reloads the load balancer in real-time to load balance traffic to the backends.

## Edge-LB pool

The Edge-LB pool provides the main load balancing and proxying functionalities for the cluster. The pool instances are created, deleted, or updated through the Edge-LB API server. When a CLI client installs a configuration pool defined in a JSON file, the API server launches an Edge-LB pool. Pool configurations are added to specific backend service by deploying a new pool configuration file by operators.

Edge-LB pool instances leverage built-in HAProxy functionality for core load balancing and proxying features. Every time an Edge-LB pool is launched, the pool launches the HAProxy instances inside the pool instance to proxy and load balance services to proper backends.

The pool configuration depends on size of the organization, roles, responsibilities, and other factors.

Like other services in DC/OS, pool instances are also self-healing. If an pool instance is killed, DC/OS will automatically respawn the pool instances in other available agents.
