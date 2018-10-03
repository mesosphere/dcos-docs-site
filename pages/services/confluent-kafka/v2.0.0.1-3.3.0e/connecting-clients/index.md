---
layout: layout.pug
navigationTitle:  Connecting clients
title: Connecting clients
menuWeight: 30
excerpt:
featureMaturity:
enterprise: false
---

<!-- This source repo for this topic is https://github.com/mesosphere/confluent -->


One of the benefits of running containerized services is that they can be placed anywhere in the cluster. Because they can be deployed anywhere on the cluster, clients need a way to find the service. This is where service discovery comes in.

## Discovering endpoints

Once the service is running, you can view information about its endpoints using either of the following methods:
- List endpoint types: `dcos confluent-kafka endpoints --name=confluent-kafka`
- View endpoints for an endpoint type: `dcos confluent-kafka endpoints  <endpoint> --name=confluent-kafka`

Returned endpoints will include the following:
- `.mesos` hostnames for each instance, which will follow them if they're moved within the DC/OS cluster.
- A HA-enabled VIP hostname for accessing any of the instances (optional).
- A direct IP address for accesssing the service if `.mesos` hostnames are not resolvable.

In general, the `.mesos` endpoints will only work from within the same DC/OS cluster. From outside the cluster, you can either use the direct IPs or set up a proxy service that acts as a frontend to your Confluent Kafka instance. For development and testing purposes, you can use [DC/OS Tunnel](/1.8/administration/access-node/tunnel/) to access services from outside the cluster, but this option is not suitable for production use.
