---
layout: layout.pug
navigationTitle:
excerpt:
title: Operations
menuWeight: 30
model: /services/couchbase/data.yml
render: mustache
---

#include /services/include/operations.tmpl

## More on POD Replace

If a couchbase server node becomes unresponsive you need to `failover` to the remaining healthy nodes. Failover can be initiated via the couchbase console or cli. You can also configure auto failover. More information on couchbase failover you can find [here](https://developer.couchbase.com/documentation/server/current/clustersetup/failover.html)

After `failover` a `rebalance` needs to be initiated. Rebalance can be initiated via the couchbase console or cli. The rebalance will remove the unresponsive node from the cluster and distribute the data even across the remaining nodes.

Next you use the couchbase service `replace` command to permanently replace the unresponsive node with a new one using the following command. More on replace you can find in [Pod Operations](#replace) and in [Troubleshooting](../troubleshooting/#replacing-a-permanently-failed-node).

```
dcos couchbase pod replace <pod-name>
```

Replace will create the new node and add it to the couchbase cluster, except node `data-0` which will be created but has to be added via the couchbase console or cli to the couchbase cluster. If multiple nodes have to be replaced and data-0 is amongst them always start with data-0.

After a node is replaced again a `rebalance` is necessary.


## Backup & Restore

For backup and restore we leverage the `cbbackupmgr` tool that comes with couchbase enterprise.

A dedicate `backpumgr service` node has to be launched, see respective section in the dcos couchbase service configuration. It provides the volume to store the incremental snapshots of the database, and provides tasks for the various `cbbackupmgr` commands (backup, restore, list, merge)

The backupmgr node is setup with a connection to an s3 (compatible) store (default is minio). The tasks use `aws s3 sync` command to keep the incremental snapshots on the backupmgr node and in the connected s3 bucket in sync.

**Note:** In your s3 store you will have to create a bucket with the name that you specified in the backupmgr configuration.

`backupmgr-backup` creates a incremental snapshot and syncs it with s3 bucket.

```
dcos couchbase plan start backupmgr-backup
```

`backupmgr-restore` syncs with s3 bucket then does the restore. Empty couchbase buckets have to be created before the restore.

**Note:** Before you use the command make sure that the buckets exist. They have to exist even if they are empty.

```
dcos couchbase plan start backupmgr-restore
```

`backupmgr-list` lists the snapshots. You find the snapshot list in the sdtout log of the task along with their timestamps. You will need the timestamps for the merge command.

```
dcos couchbase plan start backupmgr-list
```

`backupmgr-merge` allows you to merge snapshots together. Snapshots have a timestamp, you can get them via the list command. After the merge is completed it is also synced with the s3 bucket. After that both only contain the merged snapshot.

```
dcos couchbase plan start backupmgr-merge -p MERGE_START=<start-time-stamp> -p MERGE_END=<end-time-stamp>
```
