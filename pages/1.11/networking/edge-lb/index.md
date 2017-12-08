---
layout: layout.pug
navigationTitle:  Edge-LB
title: Edge-LB
menuWeight: 2
excerpt:
featureMaturity:
enterprise: true
---

Edge-LB builds upon on HAProxy. HAProxy provides base functionality such as load balancing for TCP and HTTP-based applications, SSL support, and health checking. In addition, Edge-LB provides first class support for zero downtime service deployment strategies, such as blue/green deployment. Edge-LB subscribes to Mesos and updates HAProxy configuration in real time.

Edge-LB proxies and load balances traffic to all services that run on DC/OS. In contrast, Marathon-LB can only work with Marathon tasks. For example, if you are using Cassandra, Edge-LB can load balance the tasks launched by Cassandra.
