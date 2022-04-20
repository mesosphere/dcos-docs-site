---
layout: layout.pug
navigationTitle: MySQL Cluster
title: Scalability and operations for the Kaptain MySQL Cluster
menuWeight: 70
excerpt: Scalability and operations for the Kaptain MySQL Cluster
beta: false
enterprise: false
---

Learn how to scale and backup/restore the MySQL cluster with Kaptain. Kaptain provides a consolidated
MySQL cluster with primary-primary replication for storage of the Pipelines execution history and artifacts,
and Katib experiment results. 

## Prerequisites

-   You already provisioned a DKP cluster using at least `v2.1.1`.

## Overview
By default, the MySQL cluster is based on Percona XtraDB, and consists of 3 database nodes and 2 proxy nodes. The database nodes run MySQL daemons and store the data, and the proxy nodes run HAProxy and expose the database to the clients via a Kubernetes Service.

The database nodes form a primary-primary database cluster. This means there are no secondary nodes; That is all data is consistent across all the cluster nodes whenever a database operation completes successfully.

Horizontally scaling the database nodes will result in more replicas of the data available for recovery in case of a failure. However, it will not result in better performance because of the replication model.

To achieve better performance, the database nodes should be scaled vertically by adding more resources, such as CPU and memory.

To get more information about installing Kaptain with custom configuration, refer to [Deploy Kaptain][deploy-kaptain] documentation page.

<p class="message--warning"><strong>WARNING: </strong>The Kaptain MySQL cluster does not support simultaneous changes to the database resources and the number of database nodes at the same time. If changes in both are required, you should perform them sequentially (that is increase resources, and then scale, or vice versa.)</p>

<p class="message--warning"><strong>WARNING: </strong>The Kaptain MySQL cluster does not support updates of Proxy nodes and MySQL nodes at the same time. Update operations should be performed for each component independently.</p>

## Scaling the MySQL cluster horizontally

### Scaling Proxy nodes
To change the number of the proxy nodes, create or update a `ConfigMap` with Kaptain configuration and include the following values:
```yaml
core:
  db:
    proxy:
      count: "3"
```

The `core.db.proxy.count` property controls the number of HAProxy replicas which serve as the database endpoint and are exposed via a Kubernetes `Service`. Increasing the number of proxy replicas is recommended if you observe a consistently high connection failure rate.

### Scaling MySQL nodes
To change the number of the database nodes, create or update a `ConfigMap` with Kaptain configuration and include the following values:
```yaml
core:
  db:
    nodes:
      count: "5"
```

The `core.db.nodes.count` property determines the number of MySQL instances in the cluster. The higher the number, the more copies of the data that will be stored. The default number of nodes is set to 3 for the best redundancy/throughput ratio. It is recommended to increase the number of replicas if you have unstable physical infrastructure or there is a high risk of data loss because of the unstable storage layers.

<p class="message--warning"><strong>WARNING: </strong>When scaling the existing database cluster down (that is decreasing the number of nodes), it is possible for clients to lose connectivity if the leader node is decommissioned. Once a new leader is elected, the clients will be able to reconnect.</p>

## Configuring MySQL cluster resources

### Configuring resources for Proxy nodes
To change the compute resources for the proxy nodes, create or update a `ConfigMap` with Kaptain configuration and include the following values:
```yaml
core:
  db:
    proxy:
      memory: "2G"
      cpu: "2"
```

The `core.db.proxy.cpu` and `core.db.proxy.memory` properties set the CPU and memory requests for the HAProxy instances in the cluster.

### Configuring resources for MySQL nodes
To change the compute resources for the database nodes, create or update a `ConfigMap` with Kaptain configuration and include the following values:
```yaml
core:
  db:
    nodes:
      memory: "3G"
      cpu: "3"
```

The `core.db.nodes.cpu` and `core.db.nodes.memory` properties set the CPU and memory requests for the MySQL instances in the cluster.

<p class="message--warning"><strong>WARNING: </strong>To update the parameters, the existing database cluster will be restarted in a rolling manner, that is, one node at a time. It is possible for clients to lose connectivity when the leader node is restarted. Once a new leader is elected, clients will be able to reconnect.</p>

## Creating a backup for the MySQL cluster
Kaptain uses Percona Operator to backup and restore the state of MySQL database.

You must create a Kubernetes `Secret` with AWS access credentials for the backup and then update the Kaptain configuration to enable backup and configure the storage location.

Create a Kubernetes `Secret` in the same namespace where Kaptain is installed using the AWS credentials as follows:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysql-backup-secret
  namespace: ${WORKSPACE_NAMESPACE}
type: Opaque
data:
  AWS_ACCESS_KEY_ID: <base64-enconded AWS Access Key ID>
  AWS_SECRET_ACCESS_KEY: <base64-enconded AWS Secret Access Key>
```

To enable backups and configure backup location, create or update a `ConfigMap` with Kaptain configuration and include the following values:
```yaml
core:
  db:
    backup:
      enabled: true
      bucket: "<S3 bucket to use for uploading the backup>"
      region: "<S3 bucket region, for example us-west-2>"
      secretName: "<The name of the created secret, for example mysql-backup-secret>"
      endpointUrl: "<Optionally specify the S3 storage endpoint>"
```

To perform a backup, apply the following manifest to trigger the backup plan for the MySQL cluster component:
```bash
export WORKSPACE_NAMESPACE=<workspace_namespace>
cat <<EOF | kubectl apply -f -
apiVersion: pxc.percona.com/v1
kind: PerconaXtraDBClusterBackup
metadata:
  name: kaptain-mysql-backup
  namespace: ${WORKSPACE_NAMESPACE}
spec:
  pxcCluster: kaptain-mysql-store
  storageName: s3-backup
EOF
```

After the backup completes, it will be uploaded to the configured S3 bucket, for example:
```bash
aws s3 ls s3://kaptain-backup/
  28KiB kaptain-mysql-store-2021-04-05-23:49:57-full.md5
     0B kaptain-mysql-store-2021-04-05-23:49:57-full.sst_info/
     0B kaptain-mysql-store-2021-04-05-23:49:57-full/
```
## Restoring the MySQL cluster from a backup

<p class="message--warning"><strong>WARNING: </strong>The restore operation will terminate the running MySQL cluster and delete all the existing data. The data from the backup will be used to bootstrap a new cluster. The restore operation introduces downtime for the duration of the restore process.</p>

Restoring the database cluster from a backup is possible in two ways:
* Using the latest backup created by the `PerconaXtraDBClusterBackup` custom resource
* Using a selected backup. For example, an older one.

Both approaches assume the backup has been performed at least once, and the data is available in S3.

### Restoring the MySQL cluster from the latest backup
Before beginning, ensure that the following properties are set in the Kaptain installation:
```yaml
core:
  db:
    backup:
      enabled: true
      bucket: "<S3 bucket to use for uploading the backup>"
      region: "<S3 bucket region, for example us-west-2>"
      secretName: "<The name of the created secret, for example mysql-backup-secret>"
      endpointUrl: "<Optionally specify the S3 storage endpoint>"
```
To restore from the latest available backup in S3, run the following command:
```bash
cat <<EOF | kubectl apply -f -
apiVersion: pxc.percona.com/v1
kind: PerconaXtraDBClusterRestore
metadata:
  name: kaptain-mysql-restore
  namespace: ${WORKSPACE_NAMESPACE}
spec:
  pxcCluster: kaptain-mysql-store
  backupName: kaptain-mysql-backup
```

The operation will use the latest backup data created by the backup referenced in `backupName`.

### Restoring the MySQL cluster from a specific S3 backup

To restore from a specific backup location, set the `BACKUP_RESTORE_SOURCE` variable to point to the location of a backup which should be used for restoring the cluster.
```bash
# Full path to the backup folder, e.g.s3://mysql-store-backup/kaptain-mysql-store-2021-04-05-21:47:24-full
export BACKUP_RESTORE_SOURCE=""
# Secret name with AWS credentials, e.g. "mysql-backup-secret"
export BACKUP_CREDENTIALS_SECRET=""
# Bucket region, e,g. "us-west-2"
export BACKUP_BUCKET_REGION=""
# URL of the S3-compatible storage, if needed 
export BACKUP_ENDPOINT_URL=""
```
Apply the following manifest to restore MySQL cluster:
```bash
cat <<EOF | kubectl apply -f -
apiVersion: pxc.percona.com/v1
kind: PerconaXtraDBClusterRestore
metadata:
  # using fixed name to avoid hitting the character limit in the generated child resources
  name: kaptain-mysql-restore
  namespace: ${WORKSPACE_NAMESPACE}
spec:
  pxcCluster: kaptain-mysql-store
  backupSource:
    # Full path to the backup folder
    destination: "${BACKUP_RESTORE_SOURCE}"
    s3:
      credentialsSecret: ${BACKUP_CREDENTIALS_SECRET}
      region: "${BACKUP_BUCKET_REGION}"
      endpointUrl: "${BACKUP_ENDPOINT_URL}"
EOF
```

The operation will use the backup data from the location specified in `BACKUP_RESTORE_SOURCE` variable.

[deploy-kaptain]: ../../install/deploy-kaptain
