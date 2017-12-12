---
layout: layout.pug
navigationTitle:  Storage
title: Storage
menuWeight: 90
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


DC/OS applications lose their state when they terminate and are relaunched. In some contexts, for instance, if your application uses MySQL, or if you are using a stateful service like Kafka or Cassandra, you'll want your application to preserve its state. 

Configure Mesos [`Mount` disk resources](/1.10/storage/mount-disk-resources/) to enable tasks that can be restarted without data loss. 

Learn how to create stateful applications using [local persistent volumes](/1.10/storage/persistent-volume/) and [external persistent volumes](/1.10/storage/external-storage/).
