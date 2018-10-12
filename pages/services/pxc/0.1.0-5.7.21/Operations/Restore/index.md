---
layout: layout.pug
navigationTitle: Restore
excerpt:
title: Restore Operation 
menuWeight: 30
model: /services/pxc/data.yml
render: mustache
---

# Restore

The restore plan is a manual process and will be used to restore any backed up data from any S3 compatible data store.

## The restore process is as follows:

1. All POD of PXC should be paused.

```shell
{
dcos percona-pxc-mysql --name=percona-pxc-mysql debug pod pause <pod-name> -t <task-name>
}
```

2. Then run the following dcos cli command for running the restore plan.

```shell
{
dcos percona-pxc-mysql plan start restore -p ACCESS_KEY_ID=<ACCESS_KEY> -p SECRET_ACCESS_KEY=<SECRET_ACCESS_KEY>
}
```

3. Then start the pxc pod one by one in sequential manner by using the following command:

```shell
{
dcos percona-pxc-mysql --name=percona-pxc-mysql debug pod resume <pod-name> -t <task-name>
}
```

This will restore the backed up PXC data to your existing cluster.

