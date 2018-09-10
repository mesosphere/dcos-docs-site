---
layout: layout.pug
navigationTitle: Restore
title: Restore Operation
menuWeight: 30
excerpt: Restore Operation of Minio
featureMaturity:
enterprise: false
---

# Restore

The DC/OS Minio Service let's you restore the backed up data in AWS S3 compatible storage to the DC/OS Minio storage system. Restore plan is especially useful in case if Disk failure/Node failure prevents you from accessing your data. However, Minio is resilient to half the number of Disk failures. Restore plan will be useful if more than half the number of disks are corrupted. 
The following information and values are required to restore your data.

    1. ACCESS_KEY_ID
    2. SECRET_ACCESS_KEY  
    3. S3_BUCKET
    
 This plan can be executed with the below command by providing the following parameters:

```shell
{
 dcos miniod --name=<SERVICE_NAME> plan start restore \
  -p ACCESS_KEY_ID=<ACCESS_KEY> \
  -p SECRET_ACCESS_KEY=<SECRET_ACCESS_KEY> \
  -p S3_BUCKET=<BUCKET_NAME>
}
````

Once this plan is executed, it will restore the data in the specified bucket in AWS S3 compatible storage to DC/OS Minio.

The Restore plan will execute the below tasks:

1. `Restore Task` -  Restore task is responsible to restoring the data. Restore plan will have to be launched against each backed up S3 bucket. The restore task will run the ‘mc mirror’ command by taking ACCESS_KEY_ID and SECRET_ACCESS_KEY and S3_BUCKET as parameters. Restore task will create a bucket with same name which was in the Minio storage system previously (i.e. it will drop the prefix service name from the bucket which was attached in S3 compatibale storage while backup plan.

[<img src="../../img/Restore.png" alt="Restore" width="800"/>](../img/Restore.png)

   _Figure 2. - Restoring the data
   
'restore' plan will execute the two aforementioned tasks serially. 


