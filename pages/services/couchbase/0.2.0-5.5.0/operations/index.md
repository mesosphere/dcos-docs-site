---
layout: layout.pug
navigationTitle:
excerpt: Running Couchbase operations
title: Operations
menuWeight: 30
model: /services/couchbase/data.yml
render: mustache
---

#include /services/include/operations.tmpl

## More on POD Replace

If a {{ model.serverName }} node becomes unresponsive, you must failover to the remaining healthy nodes. Failover can be initiated via the {{ model.techName }} dashboard or the CLI. You can also configure auto failover. You can find more information on {{ model.techName }} failover [here](https://developer.couchbase.com/documentation/server/current/clustersetup/failover.html).

After failover, a rebalance must be initiated. Rebalance can be initiated via the {{ model.techName }} dashboard or the CLI. The rebalance will remove the unresponsive node from the cluster and distribute the data evenly across the remaining nodes.

You will then use the {{ model.serverName }} `replace` command to permanently replace the unresponsive node with a new one using the `pod replace` command. You can find more on the `pod replace` command in [Pod Operations](#replace) and in [Troubleshooting](../troubleshooting/#replacing-a-permanently-failed-node).

```
dcos {{ model.packageName }} pod replace <pod-name>
```

`Replace` will create the new node and add it to the {{ model.techName }} cluster, except that node `data-0` will be created and must be added via the {{ model.techName }} dashboard or the CLI to the {{ model.techName }} cluster. If multiple nodes have to be replaced and `data-0` is among them, you should always start with `data-0`.

After a node is replaced, again a `rebalance` is necessary.


## Backup and Restore

For backup and restore, we leverage the `cbbackupmgr` tool that comes with {{ model.techName }} Enterprise.

A dedicate `backupmgr service` node must be launched; see the respective section in the DC/OS {{ model.serviceName }} configuration. It provides the volume to store the incremental snapshots of the database, and provides tasks for the various `cbbackupmgr` commands (`backup`, `restore`, `list`, `merge`).

The `backupmgr` node is set up with a connection to an AWS S3 (compatible) store (default is `minio`). The tasks use the `aws s3 sync` command to keep the incremental snapshots on the `backupmgr` node and in the connected s3 bucket in sync.

<table class=“table note” bgcolor=#7d58ff>
<tr> 
  <td align=justify style=color:white><strong>Note:</strong> In your AWS S3 store, you must create a bucket with the name that you specified in the "backupmgr" configuration.</td> 
</tr> 
</table>


`backupmgr-backup` creates a incremental snapshot and syncs it with the AWS S3 bucket.

```
dcos {{ model.packageName }} plan start backupmgr-backup
```

`backupmgr-restore` syncs with an AWS S3 bucket, then restores the backup. Empty {{ model.techName }} buckets have to be created before you attempt a restore.

<table class=“table note” bgcolor=#7d58ff>
<tr> 
  <td align=justify style=color:white><strong>Note:</strong> Before you use the command, make sure that the buckets exist. They have to exist even if they are empty.</td> 
</tr> 
</table>

```
dcos {{ model.packageName }} plan start backupmgr-restore
```

`backupmgr-list` lists the snapshots. You will find the snapshot list in the `sdtout` log of the task, along with their timestamps. You will need the timestamps for the merge command.

```
dcos {{ model.packageName }} plan start backupmgr-list
```

`backupmgr-merge` allows you to merge snapshots together. Snapshots have a timestamp; you can get them using the `list` command. After the merge is completed it is also synced with the AWS S3 bucket. After that, both only contain the merged snapshot.

```
dcos {{ model.packageName }} plan start backupmgr-merge -p MERGE_START=<start-time-stamp> -p MERGE_END=<end-time-stamp>
```
