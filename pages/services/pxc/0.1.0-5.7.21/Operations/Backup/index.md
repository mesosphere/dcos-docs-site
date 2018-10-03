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

For backup, we need to run backup using the following command using dcos cli:

```shell
{
 dcos percona-pxc-mysql plan start backup -p ACCESS_KEY_ID=<ACCESS_KEY> -p SECRET_ACCESS_KEY=<SECRET_ACCESS_KEY>
}
```

The backup plan for PXC, backs up data to a S3 compatible datastore.

