---
layout: layout.pug
navigationTitle: Restore
excerpt: Restoring backed up data from data store
title: Restore Operation 
menuWeight: 33
model: /services/pxc/data.yml
render: mustache
---

# Restore

Restoring is a manual process and will be used to restore any backed up data from any S3-compatible data store.

## Restoring from backup

1. Pause all {{ model.techName }} Server tasks.

```shell
{
dcos {{ model.serviceName }} --name={{ model.serviceName }} debug pod pause <pod-name> -t <task-name>
}
```

2. Start the restore plan.

```shell
{
dcos {{ model.serviceName }} plan start restore -p ACCESS_KEY_ID=<ACCESS_KEY> -p SECRET_ACCESS_KEY=<SECRET_ACCESS_KEY>
}
```

3. Resume all {{ model.techName }} Server tasks sequentially such that a node is resumed only when its predecessor node has arrived in synced state:

```shell
{
dcos {{ model.serviceName }} --name={{ model.serviceName }} debug pod resume <pod-name> -t <task-name>
}
```

This will restore the backed up {{ model.techAcronym }} data to your existing cluster.

