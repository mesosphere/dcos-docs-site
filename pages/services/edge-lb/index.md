---
layout: layout.pug
navigationTitle:  Edge-LB
title: Edge-LB
menuWeight: 30
excerpt:
model: /services/edge-lb/data.yml
render: mustache

enterprise: false
---

Edge-LB proxies and load balances traffic to all services that run on DC/OS. Edge-LB provides both North-South (external to internal) and East-West (internal to internal) load balancing.

Edge-LB builds upon HAProxy. HAProxy provides base functionality, such as load balancing for TCP and HTTP-based applications, SSL support, and health checking. In addition, Edge-LB provides first class support for zero downtime service deployment strategies, such as blue/green deployment. Edge-LB subscribes to Mesos and updates HAProxy configuration in real time.

Choose a version at the left to get started!
