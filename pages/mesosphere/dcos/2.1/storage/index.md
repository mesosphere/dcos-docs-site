---
layout: layout.pug
navigationTitle:  Storage
title: Storage
menuWeight: 90
excerpt: Preserving your application in case of termination and relaunch
render: mustache
model: /mesosphere/dcos/2.0/data.yml
enterprise: false
---

DC/OS applications lose their state when they terminate and are relaunched. In some contexts, for instance, if your application uses MySQL, or if you are using a stateful service like Kafka or Cassandra, you'll want your application to preserve its state. This section will show you how to create stateful applications to preserve your application in case of termination and relaunch.

#include /mesosphere/dcos/2.0/storage/include/dss-box.md
