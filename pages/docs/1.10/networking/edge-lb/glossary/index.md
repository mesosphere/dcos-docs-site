---
layout: layout.pug
title: Glossary
menuWeight: 7
excerpt: ""
featureMaturity: ""
enterprise: 'yes'
navigationTitle:  Glossary
---

### <a name="edge-lb"></a>Edge-LB

The entire component (API Server, Pool, and Load Balancer).

### <a name="edge-lb-api-server"></a>Edge-LB API Server

The service that responds to CLI commands and manages Pools.

### <a name="edge-lb-pool"></a>Edge-LB Pool

The unit of Load Balancer configuration within Edge-LB. The Load Balancers within the same Pool are identical.

The Pool is concerned with properties such as the number of instances of the Load Balancers and their placement.

### <a name="edge-lb-load-balancer"></a>Edge-LB Load Balancer

The individual instances of the load balancer software (e.g. HAProxy). These accept traffic and route it to the appropriate services within the DC/OS cluster.
