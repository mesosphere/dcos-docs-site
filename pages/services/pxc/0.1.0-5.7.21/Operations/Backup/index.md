---
layout: layout.pug
navigationTitle: Backup
excerpt: Backing up your service
title: Backup 
menuWeight: 30
model: /services/pxc/data.yml
render: mustache
---
# Backing Up

To back up your {{ model.techName }} service, run the following command from the CLI:

```shell
{
 dcos percona-pxc-mysql plan start backup -p ACCESS_KEY_ID=<ACCESS_KEY> -p SECRET_ACCESS_KEY=<SECRET_ACCESS_KEY>
}
```

The backup plan for {{ model.techShortName }} backs up data to a S3 compatible datastore.

