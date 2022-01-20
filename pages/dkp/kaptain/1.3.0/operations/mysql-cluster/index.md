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

-   You already provisioned a Konvoy cluster using at least `v1.7.0`.

## Overview
By default, the MySQL cluster is based on Percona XtraDB, and consists of 3 database nodes and 2 proxy nodes. The database nodes run MySQL daemons and store the data, and the proxy nodes run HAProxy and expose the database to the clients via a Kubernetes Service.

The database nodes form a primary-primary database cluster.  This means there are no secondary nodes; i.e. all data is consistent across all the cluster nodes whenever a database operation completes successfully.

Horizontally scaling the database nodes will result in more replicas of the data available for recovery in case of a failure.  However, it will not result in better performance because of the replication model.

To achieve better performance, the database nodes should be scaled vertically by adding more resources, such as CPU and memory.

<p class="message--warning"><strong>WARNING: </strong>The Kaptain MySQL cluster does not support simultaneous changes to the database resources and the number of database nodes at the same time. If changes in both are required, you should perform them sequentially (i.e. increase resources, and then scale, or vice versa.)</p>

<p class="message--warning"><strong>WARNING: </strong>The Kaptain MySQL cluster does not support updates of Proxy nodes and MySQL nodes at the same time. Update operations should be performed for each component independently.</p>

## Scaling the MySQL cluster horizontally

### Scaling Proxy nodes
To change the number of the proxy nodes, create or update a configuration file named `parameters.yaml` and include the following property:
```yaml
datastoreProxyCount: "3"
```

The `datastoreProxyCount` property controls the number of HAProxy replicas which serve as the database endpoint and are exposed via a Kubernetes `Service`. Increasing the number of proxy replicas is recommended if you observe a consistently high connection failure rate.

To install Kaptain with the provided parameters, run the following command on the cluster:
```bash
kubectl kudo install ./kubeflow-1.4.0_1.3.0.tgz \
		--instance kaptain \
		-P parameters.yaml \
		--namespace kubeflow \
		--create-namespace
```

To update an existing Kaptain instance with the updated properties, run the following command on the cluster:
```bash
kubectl kudo update \
		--instance kaptain \
		-P parameters.yaml \
		--namespace kubeflow
```

### Scaling MySQL nodes
To change the number of the database nodes, create or update a configuration file named `parameters.yaml` and include the following property:
```yaml
datastoreNodeCount: "5"
```

The `datastoreNodeCount` property determines the number of MySQL instances in the cluster. The higher the number, the more copies of the data that will be stored. The default number of nodes is set to 3 for the best redundancy/throughput ratio. It is recommended to increase the number of replicas if you have unstable physical infrastructure or there is a high risk of data loss because of the unstable storage layers.

To install Kaptain with the provided parameters, run the following command on the cluster:
```bash
kubectl kudo install ./kubeflow-1.4.0_1.3.0.tgz \
		--instance kaptain \
		-P parameters.yaml \
		--namespace kubeflow \
		--create-namespace
```

To update an existing Kaptain instance with the provided parameters, run the following command on the cluster:
```bash
kubectl kudo update \
		--instance kaptain \
		-P parameters.yaml \
		--namespace kubeflow
```

<p class="message--warning"><strong>WARNING: </strong>When scaling the existing database cluster down (i.e. decreasing the number of nodes), it is possible for clients to lose connectivity if the leader node is decommissioned. Once a new leader is elected, the clients will be able to reconnect.</p>

## Configuring MySQL cluster resources

### Configuring resources for Proxy nodes
To change the compute resources for the proxy nodes, create or update a configuration file named `parameters.yaml` and include the following properties:
```yaml
datastoreProxyNodeMemory: "2G"
datastoreProxyNodeCPU: "2"
```

The `datastoreProxyNodeCPU` and `datastoreProxyNodeMemory` properties set the CPU and memory requests for the HAProxy instances in the cluster.

To install Kaptain with the provided parameters, run the following command on the cluster:
```bash
kubectl kudo install ./kubeflow-1.4.0_1.3.0.tgz \
		--instance kaptain \
		-P parameters.yaml \
		--namespace kubeflow \
		--create-namespace
```

To update an existing Kaptain instance with the provided parameters, run the following command on the cluster:
```bash
kubectl kudo update \
		--instance kaptain \
		-P parameters.yaml \
		--namespace kubeflow
```

### Configuring resources for MySQL nodes
To change the compute resources for the database nodes, create or update a configuration file named `parameters.yaml` and include the following properties:
```yaml
datastoreMySQLNodeMemory: "3G"
datastoreMySQLNodeCPU: "3"
```

The `datastoreMySQLNodeCPU` and `datastoreMySQLNodeMemory` properties set the CPU and memory requests for the MySQL instances in the cluster.

To install Kaptain with the provided parameters, run the following command on the cluster:
```bash
kubectl kudo install ./kubeflow-1.4.0_1.3.0.tgz \
		--instance kaptain \
		-P parameters.yaml \
		--namespace kubeflow \
		--create-namespace
```

To update an existing Kaptain instance with the provided parameters, run the following command on the cluster:
```bash
kubectl kudo update \
		--instance kaptain \
		-P parameters.yaml \
		--namespace kubeflow
```

<p class="message--warning"><strong>WARNING: </strong>To update the parameters, the existing database cluster will be restarted in a rolling manner, that is, one node at a time. It is possible for clients to lose connectivity when the leader node is restarted. Once a new leader is elected, clients will be able to reconnect.</p>

## Creating a backup for the MySQL cluster
Kaptain provides dedicated KUDO plans for on-demand backup and restore operations for the MySQL cluster. Currently, Kaptain only supports backups to AWS S3.  

You must create a Kubernetes `Secret` with AWS access credentials for the backup and then update the Kaptain configuration to enable backup and configure the storage location.

Create a Kubernetes `Secret` in the same namespace where Kaptain is installed using the AWS credentials as follows:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mysql-backup-secret
type: Opaque
data:
  AWS_ACCESS_KEY_ID: <base64-enconded AWS Access Key ID>
  AWS_SECRET_ACCESS_KEY: <base64-enconded AWS Secret Access Key>
```

To enable backups and configure backup location, create or update a configuration file named `parameters.yaml` and include the following properties:
```yaml
backupEnabled: "true"
backupBucket: "<S3 bucket to use for uploading the backup>"
backupRegion: "<S3 bucket region, for example us-west-2>"
backupSecretName: "<The name of the created secret, for example mysql-backup-secret>"
backupEndpointUrl: "<Optionally specify the S3 storage endpoint>"
```

To install Kaptain with the provided parameters, run the following command on the cluster:
```bash
kubectl kudo install ./kubeflow-1.4.0_1.3.0.tgz \
		--instance kaptain \
		-P parameters.yaml \
		--namespace kubeflow \
		--create-namespace
```

To update an existing Kaptain instance with the provided properties, run the following command on the cluster:
```bash
kubectl kudo update \
		--instance kaptain \
		-P parameters.yaml \
		--namespace kubeflow
```

To perform a backup, trigger the Kaptain `backup` plan for the MySQL cluster component:
```bash
kubectl kudo plan trigger --name=backup \
        --instance kaptain-percona-xtradb-cluster-operator \
        --namespace kubeflow
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

There are two options for restoring the database cluster from a backup:
* Using the latest backup created by running a KUDO backup plan
* Using a selected backup. For example, an older one.

Both approaches assume the backup has been performed at least once, and the data is available in S3.

### Restoring the MySQL cluster from the latest backup
Before beginning, ensure that the following properties are set in the Kaptain installation:
```yaml
backupEnabled: "true"
backupBucket: "<S3 bucket to use for uploading the backup>"
backupRegion: "<S3 bucket region, for example us-west-2>"
backupSecretName: "<The name of the created secret, for example mysql-backup-secret>"
backupEndpointUrl: "<Optionally specify the S3 storage endpoint>"
```

If the `backupRestoreSource` property is set to a non-empty string, you must update this property in order to use the latest backup. To override the property, create or update a configuration file named `parameters.yaml` and set the `backupRestoreSource` property to an empty string:
```yaml
backupRestoreSource: ""
```

Then, update Kaptain using the created file:

```bash
kubectl kudo update \
		--instance kaptain \
		-P parameters.yaml \
		--namespace kubeflow
```

To perform a restore operation, trigger the Kaptain `restore` plan for the MySQL cluster component:
```bash
kubectl kudo plan trigger --name=restore \
        --instance kaptain-percona-xtradb-cluster-operator \
        --namespace kubeflow
```

The operation will use the latest backup data created by the `backup` plan.

### Restoring the MySQL cluster from a specific S3 backup
Before beginning, ensure that the following properties are set in the Kaptain installation:
```yaml
backupEnabled: "true"
backupBucket: "<S3 bucket to use for uploading the backup>"
backupRegion: "<S3 bucket region, for example us-west-2>"
backupSecretName: "<The name of the created secret, for example mysql-backup-secret>"
backupEndpointUrl: "<Optionally specify the S3 storage endpoint>"
```

Configure the `backupRestoreSource` property to point to the location of a backup which should be used for restoring the cluster.
To configure this property, create or update a configuration file named `parameters.yaml` and set the `backupRestoreSource` property.
For example:
```yaml
backupRestoreSource: "s3://kaptain-backup/kaptain-mysql-store-2021-04-05-23:49:57-full"
```

Then, update Kaptain using the created file:
```bash
kubectl kudo update \
		--instance kaptain \
		-P parameters.yaml \
		--namespace kubeflow
```

To perform the restore operation, trigger the Kaptain `restore` plan for the MySQL cluster component:
```bash
kubectl kudo plan trigger --name=restore \
        --instance kaptain-percona-xtradb-cluster-operator \
        --namespace kubeflow
```

The operation will use the backup data from the location specified in `backupRestoreSource` property.
