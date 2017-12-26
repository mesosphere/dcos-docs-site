---
layout: layout.pug
navigationTitle:  Storage
title: Storage
menuWeight: 4
excerpt:

---





DC/OS applications lose their state when they terminate and are relaunched. In some contexts, for instance, if your application uses MySQL, or if you are using a stateful service like Kafka or Cassandra, you'll want your application to preserve its state. [Configure Mesos mount disk resources](/1.7/administration/storage/mount-disk-resources/) to create local storage that allows  users to create tasks that can be restarted without data loss. Otherwise, your users can create applications that use [external storage](/1.7/usage/storage/external-storage/). [Learn how to create stateful applications](/1.7/usage/storage/).
