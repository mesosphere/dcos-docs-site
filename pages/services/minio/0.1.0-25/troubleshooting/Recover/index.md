---
layout: layout.pug
navigationTitle: Recover
title: Recover Operation
menuWeight: 30
excerpt: Recover Operation of Minio
featureMaturity:
enterprise: false
---

# Recover

The DC/OS Minio Service allows you to heal disks, buckets and objects on minio server.

This plan can be executed with the following command:
```shell
{
 dcos minio --name=<service_name> plan start recover
}
```
The Minio recover plan will be performed using below mentioned task:

1. `Recover Task` -  Recover task is responsible to heal the whole disk in case of node killed or node failure. A Recover task will run the ‘mc heal’ command.

[<img src="../../img/Recover.png" alt="Recover" width="800"/>](../../img/Recover.png)

   _Figure 1. - Recovering the disk
   
Users can execute Recover task by launching the recover plan. This plan would execute all the aforementioned tasks serially. 

