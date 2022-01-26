---
layout: layout.pug
navigationTitle: MinIO Object Store
title: Scalability and operations for the MinIO Object Store
menuWeight: 70
excerpt: Scalability and operations for the MinIO Object Store
beta: false
enterprise: false
---

Learn how to configure and expand MinIO Object Store in Kaptain.
Kaptain includes the MinIO Object Store running in a distributed mode which allows assembling multiple storage resources into a single object storage cluster. As MinIO server pods and persistent volumes are distributed across several nodes, the object store can withstand multiple node failures and still ensure full data protection.


## Prerequisites

-   You already provisioned a Konvoy cluster using at least `v1.7.0`.

## Configuring MinIO cluster
By default, the MinIO cluster consists of 2 servers, each with 2 volumes and a total capacity of 40Gi. Half of the storage will be used for [erasure coding][erasure-coding] sets, which is generally sufficient for storing semi-structured and small binary data, such as pipeline artifacts and model files.

To increase the storage capacity, the default settings can be altered during the installation of Kaptain by configuring the following properties:

`minioServers` - the number of MinIO server pods to deploy in the pool. Kaptain deploys each of the MinIO servers to a separate node to increase the redundancy and to make the object store more fault-tolerant.
Before changing this property, ensure that the cluster has a sufficient number of nodes to deploy all the servers.
`minioVolumesPerServer` - the number of Persistent Volume Claims to generate for each MinIO server pod in the pool.
The minimum total number of disks required for MinIO in distributed mode is 4, which is the minimum required for
[erasure coding][erasure-coding].
`minioStorageCapacity` - the total capacity of a single MinIO server pool.

<p class="message--warning"><strong>WARNING: </strong>By default, MinIO shards the objects across N/2 data and N/2 parity drives. Therefore, it is recommended to specify the <code>minioStorageCapacity</code> property as twice the intended usage.</p>

 To change the default MinIO cluster settings, create a configuration file `parameters.yaml` with the properties described above:
```yaml
minioServers: 4
minioVolumesPerServer: 4
minioStorageCapacity: 160Gi
```
This configuration will deploy 4 MinIO servers; each server will use 4 volumes with 10Gi capacity per volume.
To learn more about MinIO distributed mode and replication see the [official documentation][minio-docs].

To install Kaptain with the provided parameters, run the following command on the cluster:
```bash
kubectl kudo install ./kubeflow-1.4.0_1.3.0.tgz \
      --instance kaptain \
      -P parameters.yaml \
      --namespace kubeflow \
      --create-namespace
```

## Expanding the MinIO cluster

The MinIO cluster can be expanded by increasing the number of server pools in the cluster.

<p class="message--warning"><strong>WARNING: </strong>Expanding an existing server pool is not supported. The cluster can only by expanded by adding additional server pools.</p>

To update an already installed Kaptain instance with the provided parameters, run the following command on the cluster:
```bash
kubectl kudo update --instance kaptain --namespace kubeflow -p minioServerPools=2
```
This command will update the existing Kaptain instance and double the MinIO cluster capacity with almost no downtime.

## Known limitations
1. Data redundancy is only guaranteed within a single server pool - if more than a half of the drives in a pool are lost, the data cannot be reconstructed.
2. When the MinIO cluster is expanded by adding a new server pool, the data from the initial pool will not be replicated/rebalanced between the existing and the new pool.

[erasure-coding]: https://docs.min.io/docs/minio-erasure-code-quickstart-guide
[minio-docs]: https://docs.min.io/docs/
