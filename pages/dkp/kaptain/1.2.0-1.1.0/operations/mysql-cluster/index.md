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
By default, the MySQL cluster based on Percona XtraDB and which consists
of 3 database nodes and 2 proxy nodes. The database nodes run MySQL daemons and store the data,
and the proxy nodes run HAProxy and expose the database to the clients via Kubernetes Service.

The database nodes form a primary-primary database cluster which means there's no secondary nodes and
all the data is consistent across all the cluster nodes when a database operation considered successful.
Horizontal scaling of the database nodes will result in more replicas of the data available for recovery
in case of a failure, however, will not result in a better performance because of the replication model.
To achieve a better performance the database nodes should be scaled vertically which means the database pods will
require adding more resources such as CPU and memory.

<div style="color: #8a6d3b; background-color: #fcf8e3; border-color: #faebcc; padding: 15px; margin-top: 10px; margin-bottom: 10px; border: 1px solid transparent; border-radius: 4px;">
<p class="message--warning"><strong>WARNING: </strong>Kaptain MySQL cluster doesn't support changes in the resources
and the number of nodes at the same time. If both operations required, it is recommended to perform them one by one</p>
</div>
<div style="color: #8a6d3b; background-color: #fcf8e3; border-color: #faebcc; padding: 15px; margin-top: 10px; margin-bottom: 10px; border: 1px solid transparent; border-radius: 4px;">
<p class="message--warning"><strong>WARNING: </strong>Kaptain MySQL cluster doesn't support updates of Proxy nodes and
MySQL nodes at the same time. All the update operations should be performed for each component independently.</p>
</div>

## Scaling MySQL cluster horizontally

### Scaling Proxy nodes
To change the number of the proxy nodes, create or update a configuration file `parameters.yaml`
to include the following property:
```yaml
datastoreProxyCount: "3"
```

`datastoreProxyCount` parameter controls the number of HAProxy replicas which serve as a database endpoint
exposed via Kubernetes `Service`. Increasing the number of proxies is recommended when there's a consistently
high connection failure rate.

To install Kaptain with the provided parameters, run the following command on the cluster:
```bash
kubectl kudo install ./kubeflow-1.2.0_1.1.0.tgz \
		--instance kaptain \
		-P parameters.yaml \
		--namespace kubeflow \
		--create-namespace
```

To update already installed Kaptain instance with the provided parameters, run the following command on the cluster:
```bash
kubectl kudo update \
		--instance kaptain \
		-P parameters.yaml \
		--namespace kubeflow
```

### Scaling MySQL nodes
To change the number of the database nodes, create or update a configuration file `parameters.yaml`
to include the following property:
```yaml
datastoreNodeCount: "5"
```

`datastoreNodeCount` parameter is responsible for the number of MySQL instances in the cluster. The higher the
number, the more copies of the data will be stored. The default number of nodes is set to 3 for the best
redundancy/throughput ratio. It is recommended to increase the number of replicas in case of unstable
physical infrastructure or high risk of the data loss because of the unstable storage layer.

To install Kaptain with the provided parameters, run the following command on the cluster:
```bash
kubectl kudo install ./kubeflow-1.2.0_1.1.0.tgz \
		--instance kaptain \
		-P parameters.yaml \
		--namespace kubeflow \
		--create-namespace
```

To update already installed Kaptain instance with the provided parameters, run the following command on the cluster:
```bash
kubectl kudo update \
		--instance kaptain \
		-P parameters.yaml \
		--namespace kubeflow
```

<div style="color: #8a6d3b; background-color: #fcf8e3; border-color: #faebcc; padding: 15px; margin-top: 10px; margin-bottom: 10px; border: 1px solid transparent; border-radius: 4px;">
<p class="message--warning"><strong>WARNING: </strong>When scaling the existing database cluster down (decreasing the number of nodes),
it is possible for the client to lose the connectivity in case the leader node is decommissioned. Once the
new leader is elected, the new connections will be served as usual.</p>
</div>


## Configuring MySQL cluster resources

### Configuring resources for Proxy nodes
To change the compute resources for the proxy nodes, create or update a configuration file `parameters.yaml`
to include the following properties:
```yaml
datastoreProxyNodeMemory: "2G"
datastoreProxyNodeCPU: "2"
```

`datastoreProxyNodeCPU` and `datastoreProxyNodeMemory` parameters set the CPU and memory for HAProxy instances in the cluster.

To install Kaptain with the provided parameters, run the following command on the cluster:
```bash
kubectl kudo install ./kubeflow-1.2.0_1.1.0.tgz \
		--instance kaptain \
		-P parameters.yaml \
		--namespace kubeflow \
		--create-namespace
```

To update already installed Kaptain instance with the provided parameters, run the following command on the cluster:
```bash
kubectl kudo update \
		--instance kaptain \
		-P parameters.yaml \
		--namespace kubeflow
```

### Configuring resources for MySQL nodes
To change the compute resources for the database nodes, create or update a configuration file `parameters.yaml`
to include the following properties:
```yaml
datastoreMySQLNodeMemory: "3G"
datastoreMySQLNodeCPU: "3"
```

`datastoreMySQLNodeCPU` and `datastoreMySQLNodeMemory` parameters set the CPU and memory for MySQL instances in the cluster.

To install Kaptain with the provided parameters, run the following command on the cluster:
```bash
kubectl kudo install ./kubeflow-1.2.0_1.1.0.tgz \
		--instance kaptain \
		-P parameters.yaml \
		--namespace kubeflow \
		--create-namespace
```

To update already installed Kaptain instance with the provided parameters, run the following command on the cluster:
```bash
kubectl kudo update \
		--instance kaptain \
		-P parameters.yaml \
		--namespace kubeflow
```

<div style="color: #8a6d3b; background-color: #fcf8e3; border-color: #faebcc; padding: 15px; margin-top: 10px; margin-bottom: 10px; border: 1px solid transparent; border-radius: 4px;">
<p class="message--warning"><strong>WARNING: </strong>When performing the update of the parameters, the existing database cluster will be
restarted in a rolling manner (one node at a time), it is possible for the client to lose the connectivity when the leader node is recreated.
Once the new leader is elected, the new connections will be served as usual.</p>
</div>

## Creating a backup for the MySQL cluster
Kaptain provides dedicated KUDO plans for on-demand backup and restore operations for the MySQL cluster. Currently, Kaptain
supports backups to AWS S3 only. It is required to create a Kubernetes `Secret` with AWS access credentials for the backup
and update Kaptain configuration to enable backup and configure the storage location.

Create a Kubernetes `Secret` with AWS access credentials in the same namespace where Kaptain is installed with the
following contents:
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

To enable backups and configure backup location, create or update a configuration file `parameters.yaml`
to include the following properties:
```yaml
backupEnabled: "true"
backupBucket: "<S3 bucket to use for uploading the backup>"
backupRegion: "<S3 bucket region, for example us-west-2>"
backupSecretName: "<The name of the created secret, for example mysql-backup-secret>"
backupEndpointUrl: "<Optionally specify the S3 storage endpoint>"
```

To install Kaptain with the provided parameters, run the following command on the cluster:
```bash
kubectl kudo install ./kubeflow-1.2.0_1.1.0.tgz \
		--instance kaptain \
		-P parameters.yaml \
		--namespace kubeflow \
		--create-namespace
```

To update already installed Kaptain instance with the provided parameters, run the following command on the cluster:
```bash
kubectl kudo update \
		--instance kaptain \
		-P parameters.yaml \
		--namespace kubeflow
```

To perform the backup operation, trigger Kaptain `backup` plan for the MySQL cluster component:
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
<div style="color: #8a6d3b; background-color: #fcf8e3; border-color: #faebcc; padding: 15px; margin-top: 10px; margin-bottom: 10px; border: 1px solid transparent; border-radius: 4px;">
<p class="message--warning"><strong>WARNING: </strong>The restore operation terminates the running cluster and deletes all the data. 
The data from the backup is then used to bootstrap the cluster. The restore operation introduces a downtime for the duration of the 
restore process.</p>
</div>

There are two options for restoring the database cluster from a backup:
* using the latest backup created via running KUDO backup plan,
* or using some particular backup from S3

Both approaches assume the backup has been performed at least once, and the data is available in S3.

### Restoring the MySQL cluster from the latest backup
Make sure, the following properties are set:
```yaml
backupEnabled: "true"
backupBucket: "<S3 bucket to use for uploading the backup>"
backupRegion: "<S3 bucket region, for example us-west-2>"
backupSecretName: "<The name of the created secret, for example mysql-backup-secret>"
backupEndpointUrl: "<Optionally specify the S3 storage endpoint>"
```

If the operator has `backupRestoreSource` property set to a non-empty string, update this parameter
in order to use the latest backup instead. To override the parameter, create or update a configuration file `parameters.yaml`
and set `backupRestoreSource` property to an empty string:
```yaml
backupRestoreSource: ""
```

Update Kaptain using the created file:
```bash
kubectl kudo update \
		--instance kaptain \
		-P parameters.yaml \
		--namespace kubeflow
```

To perform the restore operation, trigger Kaptain `restore` plan for the MySQL cluster component:
```bash
kubectl kudo plan trigger --name=restore \
        --instance kaptain-percona-xtradb-cluster-operator \
        --namespace kubeflow
```

The operation will use the latest backup data created by the `backup` plan.

### Restoring the MySQL cluster from a specific S3 backup
Make sure, the following properties are set:
```yaml
backupEnabled: "true"
backupBucket: "<S3 bucket to use for uploading the backup>"
backupRegion: "<S3 bucket region, for example us-west-2>"
backupSecretName: "<The name of the created secret, for example mysql-backup-secret>"
backupEndpointUrl: "<Optionally specify the S3 storage endpoint>"
```

Configure `backupRestoreSource` property to point to the location of a backup which should be used for restoring the cluster.
To set the parameter, create or update a configuration file `parameters.yaml` and set `backupRestoreSource` property.
For example:
```yaml
backupRestoreSource: "s3://kaptain-backup/kaptain-mysql-store-2021-04-05-23:49:57-full"
```

Update Kaptain using the created file:
```bash
kubectl kudo update \
		--instance kaptain \
		-P parameters.yaml \
		--namespace kubeflow
```

To perform the restore operation, trigger Kaptain `restore` plan for the MySQL cluster component:
```bash
kubectl kudo plan trigger --name=restore \
        --instance kaptain-percona-xtradb-cluster-operator \
        --namespace kubeflow
```

The operation will use the backup data from the location specified in `backupRestoreSource` parameter.
