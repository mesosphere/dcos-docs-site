---
layout: layout.pug
navigationTitle: Backup-Restore  
title: Backup-Restore 
menuWeight: 40
excerpt: backup-restore for DC/OS Couchbase Services
featureMaturity:
enterprise: false
---

## backup and restore

For backup and restore we leverage the `cbbackupmgr` tool that comes with couchbase enterprise.

A dedicate `backpumgr service` node has to be launched, see respective section in the dcos couchbase service configuration. It provides the volume to store the inceremental snapshots of the database, and provides tasks for the various `cbbackupmgr` commands (backup, restore, list, merge)

The backupmgr node is setup with a connection to an s3 compatibel store (default is minio). The tasks use `aws s3 sync` command to keep the incremental snapshots on the backupmgr node and in the connected s3 bucket in sync.

**Note:** In your s3 compatible store you will have to create a bucket with the name that you specified in the backupmgr configuration.

### dcos couchbase plan start backupmgr-backup
Creates a incremental snapshot and syncs it with s3 bucket.

### dcos couchbase plan start backupmgr-restore 
Syncs with s3 bucket then does the restore. Empty couchbase buckets have to be created before the restore.

### dcos couchbase plan start backupmgr-list
Lists the snapshots. You find it in the sdtout of the task.

### dcos couchbase plan start backupmgr-merge
The merge command allows you to merge snapshots together. Snapshots have a timestamp, you can get them via the list command.

```
dcos couchbase plan start backupmgr-merge -p MERGE_START=<start-time-stamp> -p MERGE_END=<end-time-stamp>
```

After the merge is completed it is also synced with the s3 bucket. After that both only contain the merged snapshot.

