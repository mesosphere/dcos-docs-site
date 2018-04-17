---
layout: layout.pug
navigationTitle:  Storage
title: Storage
menuWeight: 90
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


DC/OS applications lose their state when they terminate and are relaunched. In some contexts, for instance, if your application uses MySQL, or if you are using a stateful service like Kafka or Cassandra, you'll want your application to preserve its state. [Configure Mesos mount disk resources](/1.9/storage/mount-disk-resources/) to enable users to create tasks that can be restarted without data loss. [Learn how to create stateful applications](/1.9/storage/persistent-volume/).
