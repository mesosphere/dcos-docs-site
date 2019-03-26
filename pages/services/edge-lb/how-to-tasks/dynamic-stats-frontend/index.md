---
layout: layout.pug
navigationTitle: Configuring the statistics port dynamically
title: Configuring the statistics port dynamically
menuWeight: 22
excerpt: How to configure the statistics port dynamically for Edge-LB load balancing
enterprise: true
---

# Before you begin

- Edge-LB [installed and running](/services/edge-lb/getting-started/installing/).

# Exposing a task without pre-assigned ports

This feature allows you to expose task without a Mesos-assigned port. 

Prior to this feature, Edge-LB only exposed task that have ports assigned by mesos. Its not a requirement for Mesos tasks to have port assigned always. By leveraging this feature, when there is no port assigned for task, an Operator can specify a port in the pool config to expose that task.

# Allow dynamic allocation of the HAProxy Stats port

This feature allows allocating Stats port dynamically if there is more than on pool on an agent node. 

Prior to this feature, it wasn't possible to disable Stats port 9090 for a pool. This results in having only one Edge-LB pool per agent. Thus, it wasn't possible to deploy two Edge-LB pools on the same agent without manually setting different values for Stats port. By leveraging this feature, multiple pools on the same agent can have Stats port without port conflict.

# Allow dynamic allocation of the HAProxy frontend port

This feature allows allocating Frontend port dynamically if there is more than on pool on an agent node. 

When a public cloud LB like AWS ELB is sitting in front of Edge-LB, the ELB will handle the proxy/ load-balancing between the Client and Edge-LB pool. In such scenarios having frontend ports doesn't provide much value. By leveraging this feature, you can have multiple Frontend ports allocated dynamiccaly for multiple Edge-LB pools on the same agent for better resource utilization.
