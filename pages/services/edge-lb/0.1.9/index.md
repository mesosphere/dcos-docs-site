---
layout: layout.pug
navigationTitle:  Edge-LB
title: Edge-LB
menuWeight: 0
excerpt:

enterprise: false
---

Edge-LB proxies and load balances traffic to all services that run on DC/OS. Edge-LB provides both North-South (external to internal) and East-West (internal to internal) load balancing.

Edge-LB builds upon HAProxy. HAProxy provides base functionality, such as load balancing for TCP and HTTP-based applications, SSL support, and health checking. In addition, Edge-LB provides first class support for zero downtime service deployment strategies, such as blue/green deployment. Edge-LB subscribes to Mesos and updates HAProxy configuration in real time.

# Architecture

Edge-LB has a 3-part architecture: [API server](#edge-lb-api-server), [pool](#edge-lb-pool), and [load balancer](#edge-lb-load-balancer). These components run on top of DC/OS.

Edge-LB runs as a DC/OS service launched by [Marathon](/1.10/deploying-services/). The API server component of Edge-LB launches the load balancer pool(s). From the perspective of Marathon, the pool is another DC/OS service.

The diagram below shows how configuration and outside requests flow through Edge-LB to the application backend tasks.

Configuration is sent to the API Server, which controls pool management.

Outside traffic moves through a hardware load balancer, then to the load balancer pool. One of the Edge-LB load balancers in the pool accepts the traffic and routes it to the appropriate service within the DC/OS cluster.

![Edge-LB Architecture](/service-docs/edge-lb/0.1.9/img/edge-lb-flow.png)

## <a name="edge-lb-api-server"></a>Edge-LB API Server

The service that responds to CLI commands and manages pools.

## <a name="edge-lb-pool"></a>Edge-LB Pool

An Edge-LB pool is a group of load balancers; to the pool is balanced among the load balancers in the pool. The load balancer pool manages properties such as the number of instances of the load balancers and their placement.

The pool is the smallest unit of load balancer configuration within Edge-LB. The load balancers within the same pool are identical. You can configure Edge-LB to have multiple load balancer pools with different configurations.


## <a name="edge-lb-load-balancer"></a>Edge-LB Load Balancer

The individual instances of the load balancer software (e.g., HAProxy). These accept traffic and route it to the appropriate services within the DC/OS cluster.

# Multiple Edge-LB Instances

Multiple instances of Edge-LB can be run across multiple DC/OS public nodes to create a highly-available load balanced environemnt and to support increased throughput. There are two primary external architectures that support this:

- External Load Balancer: Place multiple Edge-LB Load Balancer instances (on DC/OS public nodes) behind an external load balancer, and direct end users or clients to the external load balancer device. The external load balancer can be a cloud-based load balancer, such as an AWS Elastic Load Balancer (ELB), an Azure Load Balancer, or a physical load balancer such as an F5 or Cisco ACE device.

- Round Robin DNS: Configure DNS such that a single DNS entry responds with IP addresses for multiple DC/OS public nodes, each of which has an Edge-LB Load Balancer instance.
