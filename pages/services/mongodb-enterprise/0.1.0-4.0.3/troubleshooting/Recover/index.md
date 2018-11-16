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

The DC/OS Minio Service let's you heal buckets and objects on the Minio server as in case of disk/node failure, the Minio cluster is required to be healed if fresh disks are added to the Minio cluster. 

'recover' plan can be executed with the following command:
```shell
{
 dcos miniod --name=<service_name> plan start recover
}
```
The Minio recover plan will be launching below mentioned task:

1. `Recover Task` -  Recover task is responsible to heal buckets and objects in case of disk/node failure. 'recover' task will run the ‘mc heal’ command.

   In case of Node Replace when the pod start on different node then Recover task will get executed.
   In case of Node Failure when Node again comes up then Recover plan get executed.Specifically, the number of parity blocks and number of data blocks get restore.

[<img src="../../img/Recover.png" alt="Recover" width="800"/>](../../img/Recover.png)

   _Figure 1. - Recovering the disk 
