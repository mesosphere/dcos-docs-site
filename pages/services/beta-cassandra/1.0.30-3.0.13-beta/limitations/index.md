---
layout: layout.pug
navigationTitle:  Limitations
title: Limitations
menuWeight: 110
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos-cassandra-service -->


- For multi-data-center configurations, the hostnames for the seed nodes in each cluster must be routable from every other cluster. Typically, DC/OS hosts are members of a private subnet that is not routable from external hosts, so further network configuration is required to achieve this.
