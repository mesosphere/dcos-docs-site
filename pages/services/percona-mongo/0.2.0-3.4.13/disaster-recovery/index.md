---
post_title: Disaster Recovery
menu_order: 80
post_excerpt: ""
enterprise: 'no'
---

## Backup

The service supports a custom plan named 'backup' for creating a consistent backup of the MongoDB replica set. This custom plan launches an instance of [Percona-Lab/mongodb_consistent_backup](), creates a consistent backup of the replica set and uploads the backup to remote storage. 

Currently only AWS S3 is supported as an upload destination for backups, more upload methods coming in the future!

There are two ways to configure backups, via the service definition section 'backup' (via the GUI or CLI) and/or the DCOS CLI.

### Hidden Secondary Member
The service supports the ability to launch a dedicated MongoDB [hidden secondary](https://docs.mongodb.com/manual/core/replica-set-hidden-member/) replica set member for purpose of performing backups.

[Hidden secondary](https://docs.mongodb.com/manual/core/replica-set-hidden-member/) members cannot become Primary in a failover situation and are hidden to application drivers.

The use of a dedicated backup secondary gurrantees backups *(a very resource-intensive process)* do not impact database nodes used by the application, therefore we recommend this is enabled when using backups. Enabling a hidden secondary will add a task named *'backup-0-mongod'* to the service. This node will inherit all settings from the other replica set nodes.

### Start a Backup

Backups are started using the 'percona-mongo' CLI modules 'backup' command.

If the AWS Access Key, Secret Key, S3 Bucket Name and S3 Bucket Prefix are already defined in your service options the following will start a backup:
```bash
dcos percona-mongo backup run s3
```

If the AWS configuration/credentials are NOT defined in the service options or you would like to override them, define the options on the command line with the following:
```bash
dcos percona-mongo backup run s3 \
    --access-key=XXXXXXXXXXXXXXXXXXX \
    --secret-key=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX \
    --bucket-name=my-s3-bucket-name \
    --bucket-prefix=/mongobackups \
    --region=eu-central-1
```

A successful start of the backup will return the following:
```bash
{
  "message": "Received cmd: start"
}
```

A task named *'mongodb-consistent-backup-0-backup'* will exist for the duration of the backup and upload.

### Stopping a Backup

To stop a running backup process:
```bash
dcos percona-mongo backup stop s3
```

### Troubleshooting a Backup

To troubleshoot problems with backups, add the flag *'--backup-verbose'* to the backup command. Please report any issues with mongodb_consistent_backup to [https://github.com/Percona-Lab/mongodb_consistent_backup/issues/new](https://github.com/Percona-Lab/mongodb_consistent_backup/issues/new).

Backups created by mongodb_consistent_backup can be restored manually using the [mongorestore](https://docs.mongodb.com/manual/reference/program/mongorestore) command with the *'--oplogReplay'* flag included and the *'--host'* flag set to the host list provided by the 'mongo-port' endpoint. Include the *'--gzip'* flag if your backup used compression *(look for .bson.gz files)*.

## Restore

Restores using the DC/OS CLI or GUI are not yet supported. This must be done manually using a system that has a recent version of the 'mongodump' tool.

We recommend [mongorestore](https://docs.mongodb.com/manual/reference/program/mongorestore/) is used to restore backups manually against the service endpoint until restores are supported. Use the *'--oplogReplay'* flag with mongorestore to restore with point-in-time consistency. We recommend the *'--drop'** flag is used on restore to delete a collection before restoring it, preventing duplicate key errors, although use this with caution!

Example Restore *(mongorestore will prompt for password due to password equal to "")*:
```
mongorestore \
    --gzip \
    --drop \
    --oplogReplay \
    --host=<hostname> \
    --username=<username> \
    --password="" \
    --dir=/path/to/mongodump/dir
```
*Note: replace the flags '--host', '--username' and '--dir' above for your situation. 'hostname' should be equal to the 'mongo-port' endpoint DNS list*
