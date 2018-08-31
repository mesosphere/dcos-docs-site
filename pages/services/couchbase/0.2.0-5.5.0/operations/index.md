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
