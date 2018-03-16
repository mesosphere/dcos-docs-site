---
layout: layout.pug
navigationTitle:  Storage
title: Storage
menuWeight: 100
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


DC/OS applications lose their state when they terminate and are relaunched. In some contexts, for instance, if your application uses MySQL, or if you are using a stateful service like Kafka or Cassandra, you'll want your application to preserve its state. Use [local persistent volumes](/1.8/usage/storage/persistent-volume/) or [external volumes](/1.8/usage/storage/external-storage/) to enable tasks to be restarted without data loss. [Learn how to configure your cluster to use persistent volumes](/1.8/administration/storage/mount-disk-resources/).
