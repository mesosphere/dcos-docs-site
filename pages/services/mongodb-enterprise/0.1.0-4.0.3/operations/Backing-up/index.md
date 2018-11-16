---
layout: layout.pug
navigationTitle: Back-up
title: Back-up Operation
menuWeight: 30
excerpt: Backing-up Operation of Minio
featureMaturity:
enterprise: false
---

# Backing up

The DC/OS Minio Service allows you to back up your data to AWS S3 compatible storage. For backing up data to AWS S3 compatible bucket, DC/OS Minio uses ‘mc mirror’ command. Minio provides a ‘rsync’ like command line utility. It mirrors data from one bucket to another. The following information and values are required to back up your data.

    1. ACCESS_KEY_ID
    2. SECRET_ACCESS_KEY
    
To enable backup, trigger the backup Plan with the following plan parameters:
```shell
{
 'ACCESS_KEY_ID': access_key_id,
 'SECRET_ACCESS_KEY': secret_access_key
}
``` 

Plans are executed in DC/OS with the following command:
```shell
{
 dcos miniod --name=<service_name> plan start <plan_name> -p <plan_parameters>
}
```
For launching backup plan, issue the below command with the requisite parameters:

```shell
{
 dcos miniod --name=<SERVICE_NAME> plan start backup \
  -p ACCESS_KEY_ID=<ACCESS_KEY> \
  -p SECRET_ACCESS_KEY=<SECRET_ACCESS_KEY>
}
````

Once this plan is executed, the backup will be uploaded to S3 compatible storage.

Backup will be performed using below sidecar task:

1. `Backup Task` - The Backup task is responsible for making a backup of the data in the DC/OS Minio storage to the AWS S3 compatible storage. A backup task will run the ‘mc mirror’ command by taking ACCESS_KEY_ID and SECRET_ACCESS_KEY as parameters.
It will create new buckets in AWS S3 compatible storage according to the current snapshot or state of Minio storage system.While creating bucket in S3 compatible storage during backup task service name will attached to the prefix of actual bucket name in Minio. An synchronize-buckets will be responsible to delete the buckets in the AWS S3 compatible storage which were deleted in the DC/OS Minio since the last backup. A separate Pod will be started at any Private Agent. An init script will be responsible to register both Minio as well as S3 compatible client.

[<img src="../../img/Backup.png" alt="Backup" width="800"/>](../img/Backup.png)

   _Figure 1. - Backing Up to S3 compatible storage

[<img src="../../img/Creating_Bucket_In_S3.png" alt="Creating_Bucket_In_S3" width="800"/>](../img/Backup.png)

   _Figure 2. -Creation Of Bucket in S3 compatible storage
    
'backup' plan would execute aforementioned tasks serially. 

# Specify an S3 compatible storage endpoint

While deploying service from catalog user can specify S3 compatible storage by providing URL of that storage.

[<img src="../../img/S3_Compatible_1.png" alt="S3_Compatible_1" width="800"/>](../img/S3_Compatible_1.png)

   _Figure 1. - S3 bucket storage

[<img src="../../img/S3_Compatible_2.png" alt="S3_Compatible_2" width="800"/>](../img/S3_Compatible_2.png)

   _Figure 2. - S3 compatible storage(e.g. Minio)

