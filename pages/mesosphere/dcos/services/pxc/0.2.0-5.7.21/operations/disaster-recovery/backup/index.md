---
layout: layout.pug
navigationTitle: Backup
excerpt: Backing up your service to an S3-compatible endpoint
title: Backup Operation
menuWeight: 32
model: /mesosphere/dcos/services/pxc/data.yml
render: mustache
---
# Backing Up

Back up the {{ model.techName }} service by specifying the endpoint of an S3-compatible data store where the data will be backed up. The backup store endpoint is the field in the framework configuration that requires this endpoint.

## Prerequisites
This task requires the Access Key ID and the Secret Access Key of the S3-compatible data store. It will execute a backup task which will run the Xtrabackup utility of {{ model.techShortName }}. Data will be copied to S3 compatible storage with the help of  the Minio client. A bucket will be created in the S3-compatible store with the name `{{ model.serviceName }}`.

## Launching the backup plan
To launch the backup plan, run the following command from the DC/OS CLI:

```shell
{
 dcos {{ model.serviceName }} plan start backup -p ACCESS_KEY_ID=<ACCESS_KEY> -p SECRET_ACCESS_KEY=<SECRET_ACCESS_KEY>
}
```

 

