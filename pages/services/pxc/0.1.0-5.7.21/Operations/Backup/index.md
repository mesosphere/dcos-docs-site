---
layout: layout.pug
navigationTitle: Backup
excerpt:
title: Backup Operation
menuWeight: 30
model: /services/pxc/data.yml
render: mustache
---
# Backing Up

Install percona-pxc-mysql service by specifying the endpoint of the S3 compatible data store where the data will be backed up. Backup store endpoint is the field in the framework configuration that requires aforementioned endpoint.

Run the below command using dcos cli:

```shell
{
 dcos percona-pxc-mysql plan start backup -p ACCESS_KEY_ID=<ACCESS_KEY> -p SECRET_ACCESS_KEY=<SECRET_ACCESS_KEY>
}
```

This command will launch the backup plan. It requires Access Key ID and the Secret Access Key of the S3 compatible data store. It will execute a backup task which will run the Xtrabackup utility of Percona XtraDB. Data will be copied to S3 compatible storage with the help of Minio client. A bucket will be created in the S3 compatible store with the name percona-pxc-mysql.

