---
layout: layout.pug
navigationTitle:  Storage
title: Storage
menuWeight: 90
excerpt: Learn how to preserve your application in case of termination and relaunch

enterprise: false
---

<!-- The source repo for this topic is https://github.com/dcos/dcos-docs -->

This section will show you how to create stateful applications to preserve your application in case of termination and relaunch.

DC/OS applications lose their state when they terminate and are relaunched. In some contexts, for instance, if your application uses MySQL, or if you are using a stateful service like Kafka or Cassandra, you'll want your application to preserve its state.

Configure Mesos [`Mount` disk resources](/1.11/storage/mount-disk-resources/) to enable tasks that can be restarted without data loss.

Learn how to create stateful applications using [local persistent volumes](/1.11/storage/persistent-volume/) and [external persistent volumes](/1.11/storage/external-storage/).
