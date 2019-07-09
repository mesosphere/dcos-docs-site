---
layout: layout.pug
navigationTitle: Edge-LB 1.4
title: Edge-LB 1.4
menuWeight: 1
excerpt: Edge-LB proxies and load balances traffic to all services that run on DC/OS.

enterprise: true
---
Edge-LB proxies and load balances traffic to all services that run on DC/OS. Edge-LB provides North-South (external to internal) load balancing, while the [Minuteman component](/latest/networking/load-balancing-vips/) provides East-West (internal to internal) load balancing.

Edge-LB leverages HAProxy, which provides the core load balancing and proxying features, such as load balancing for TCP and HTTP-based applications, SSL support, and health checking. In addition, Edge-LB provides first class support for zero downtime service deployment strategies, such as blue/green deployment. Edge-LB subscribes to Mesos and updates HAProxy configuration in real time.