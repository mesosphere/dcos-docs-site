---
layout: layout.pug
title: Storage
menuWeight: 8
excerpt: ""
enterprise: 'yes'
featureMaturity: ""
navigationTitle:  Storage
---







DC/OS applications lose their state when they terminate and are relaunched. In some contexts, for instance, if your application uses MySQL, or if you are using a stateful service like Kafka or Cassandra, you'll want your application to preserve its state. [Configure Mesos mount disk resources](/docs/1.8/administration/storage/mount-disk-resources/) to create local storage that allows  users to create tasks that can be restarted without data loss. Otherwise, your users can create applications that use [external storage](/docs/1.8/usage/storage/external-storage/). [Learn how to create stateful applications](/docs/1.8/usage/storage/).
