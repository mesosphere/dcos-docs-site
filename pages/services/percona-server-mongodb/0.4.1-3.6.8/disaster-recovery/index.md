---
layout: layout.pug
navigationTitle:  Disaster Recovery
title: Disaster Recovery
menuWeight: 80
excerpt: Creating a backup and recovery plan
featureMaturity:
enterprise: false
model: /services/percona-server-mongodb/data.yml
render: mustache
---

# Backing Up

The service supports a custom plan for creating a consistent backup of the {{ model.dbName }} replica set that is uploaded to a remote location. The backup plan launches an instance of [Percona-Lab/mongodb_consistent_backup](https://github.com/Percona-Lab/mongodb_consistent_backup), creates a consistent backup of the replica set and uploads the backup to remote storage. Currently only AWS S3 is supported as an upload destination for backups via the plan named 'backup-s3'. More upload methods are coming in the future!

There are two ways to configure backups: via the DC/OS {{ model.techName }} service configuration section 'Backup restore' in the DC/OS web interface, or the DC/OS CLI.

### Hidden secondary member
The service supports the ability to launch a dedicated {{ model.dbName }} [hidden secondary](https://docs.mongodb.com/manual/core/replica-set-hidden-member/) replica set member to perform backups. [Hidden secondary](https://docs.mongodb.com/manual/core/replica-set-hidden-member/) members cannot become Primary in a failover situation and are hidden to application drivers.

The use of a dedicated backup secondary guarantees that backups (a very resource-intensive process) do not impact database nodes used by the application, therefore we recommend enabling this when using backups. Enabling a hidden secondary will add a task named `backup-0-mongod` to the service. This node will inherit all settings from the other replica set nodes.

## Starting a backup

Backups are started using the {{ model.techName }} CLI module's `backup` command.

If the AWS Access Key, Secret Key, S3 Bucket Name and S3 Bucket Prefix are already defined in your service options the following will start a backup:
    ```shell
    $ dcos {{ model.serviceName }} backup run s3
    ```

If the AWS configuration/credentials are not defined in the service options or you would like to override them, define the options on the command line with the following:
    ```shell
    $ dcos {{ model.serviceName }} backup run s3 \
        --access-key=XXXXXXXXXXXXXXXXXXX \
        --secret-key=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX \
        --bucket-name=my-s3-bucket-name \
        --bucket-prefix=/mongobackups \
        --region=eu-central-1
    ```

A successful start of the backup will return the following:

    ```javascript
    {
      "message": "Received cmd: start"
    }
    ```

A task named `mongodb-consistent-backup-0-backup` will exist for the duration of the backup and upload. In this example, a backup will be uploaded to `s3://my-s3-bucket-name/mongobackups/<DATE>` containing several subdirectories.

## Stopping a backup

To stop a running backup process:

    ```shell
    $ dcos {{ model.serviceName }} backup stop s3
    ```

## Troubleshooting a backup

To troubleshoot problems with backups, add the flag `--backup-verbose` to the backup command. Please report any issues with `mongodb_consistent_backup` to [https://github.com/Percona-Lab/mongodb_consistent_backup/issues/new](https://github.com/Percona-Lab/mongodb_consistent_backup/issues/new).

# Restoring

Restoring a mongodump-based backup stored on Amazon S3 is possible via the DC/OS web interface and CLI tool, including backups created by the service.

## Using backups created by {{ model.techName }}

To restore an AWS S3-based backup that was created by the {{ model.techName }} backup feature, note that the AWS S3 URL must point to the `dump` directory for the desired replica set.

**Example:**
To restore the replica set `rs` to a backup located at AWS S3 URL `s3://my-s3-bucket-name-here/backup/20170618_1600`, provide the following URL to the {{ model.techName }} Restore features: `s3://my-s3-bucket-name-here/backup/20170618_1600/rs/dump`.

## Restoring at Replica Set initiation

The service supports running a restore after the initiation of the {{ model.dbName }} Replica Set. This is useful for migrations to the `{{ model.serviceName }}` service, cloning environments, and so on.

Steps:
1. In the DC/OS web interface, go to **Catalog**.
1. Find the **{{ model.serviceName }}** service.
1. Press **Review & Run**.
1. Go to the **Backup Restore** tab in the service configuration. 
1. Set your AWS Access Key (`accessKey`) and Secret Key (`secretKey`) in the **Aws s3 configuration** section. This user must have access to the read the backup.
1. Enter the AWS S3 URL to the `dump` backup directory that was outputted by mongodump into the `s3Url` field.
1. Check the `restoreAfterInit` field, to enable the restore once the replica set has been initiated.
1. Wait for the task `restore-0-restore-s3` to reach the **FINISHED** state.

### Restore using the DC/OS CLI

Start a manual restoration using the {{ model.techName }} CLI module's `restore` command.

If the AWS Access Key and Secret Keyare already defined in your service options, the following will start a restore:

    ```shell
    $ dcos {{ model.serviceName }} restore run s3 s3://my-s3-bucket-name-here/backup/dump
    ```

If the AWS configuration/credentials are not defined in the service options or you would like to override them, define the options on the command line with the following:

    ```shell
    $ dcos {{ model.serviceName }} restore run s3 \
        --access-key=XXXXXXXXXXXXXXXXXXX \
        --secret-key=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX \
        s3://my-s3-bucket-name-here/backup/dump
    ```

### Stopping a restore process

To stop a running backup restore process:

    ```shell
    $ dcos {{ model.serviceName }} restore stop s3
    ```

### Troubleshooting a restore process

See the **Logs** page of the `restore-0-restore-s3` task to troubleshoot the restore process.
