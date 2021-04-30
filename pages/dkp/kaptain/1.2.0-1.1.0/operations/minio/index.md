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
Kaptain includes MinIO Object Store running in a distributed mode which allows assembling multiple storage resources into a single object storage cluster. As MinIO server pods and persistent volumes are distributed across several nodes
the object store can withstand multiple node failures and yet ensure full data protection.
 

## Prerequisites

-   You already provisioned a Konvoy cluster using at least `v1.7.0`.

## Configuring MinIO cluster
By default, the MinIO cluster consists of 2 servers with 2 volumes and a total capacity of 40Gi (half of that size will be used
for [erasure coding](https://docs.min.io/docs/minio-erasure-code-quickstart-guide) sets), which is generally sufficient for storing semi-structured and small binary data, such as 
pipeline artifacts and model files. To increase the storage capacity, the default settings can be altered during 
the installation of Kaptain using the following parameters:

`minioServers` - the number of MinIO server pods to deploy in the pool. Kaptain deploys each of the MinIO servers to 
a separate node to increase the redundancy and make the object store more fault-tolerant. 
Before changing this parameter make sure the cluster has a sufficient number of nodes for MinIO servers placement.
`minioVolumesPerServer` - the number of Persistent Volume Claims to generate for each MinIO server pod in the pool.
The minimum total number of disks required for MinIO in distributed mode is 4 (same as minimum disks required for 
[erasure coding](https://docs.min.io/docs/minio-erasure-code-quickstart-guide)).  
`minioStorageCapacity` - the total capacity of a single MinIO server pool.
<div style="color: #8a6d3b; background-color: #fcf8e3; border-color: #faebcc; padding: 15px; margin-top: 10px; margin-bottom: 10px; border: 1px solid transparent; border-radius: 4px;">
<p class="message--warning"><strong>WARNING: </strong>By default, MinIO shards the objects across N/2 data and N/2 parity 
drives, therefore it is recommended to specify `minioStorageCapacity` value twice as much as planned for use.</p>
</div>

 To change the default MinIO cluster settings, create a configuration file `parameters.yaml` with the parameters 
 described above:
```yaml
minioServers: 4
minioVolumesPerServer: 4
minioStorageCapacity: 160Gi
```
This configuration will deploy 4 MinIO servers, each server will get 4 volumes with 10Gi capacity per volume.  
To learn more about MinIO distributed mode and replication see the [official documentation](https://docs.min.io/docs/).

To install Kaptain with the provided parameters, run the following command on the cluster:
```bash
kubectl kudo install ./kubeflow-1.2.0_1.1.0.tgz \
      --instance kaptain \
      -P parameters.yaml \
      --namespace kubeflow \
      --create-namespace
```

## Expanding MinIO cluster

MinIO cluster can be expanded by increasing the number of server pools in the cluster. 
<div style="color: #8a6d3b; background-color: #fcf8e3; border-color: #faebcc; padding: 15px; margin-top: 10px; margin-bottom: 10px; border: 1px solid transparent; border-radius: 4px;">
<p class="message--warning"><strong>WARNING: </strong>Extending an existing server pool is not supported. The cluster 
can only be scaled linearly, by using the initial server pool as a base scale unit.</p>
</div>

To update already installed Kaptain instance with the provided parameters, run the following command on the cluster:
```bash
kubectl kudo update --instance kaptain --namespace kubeflow -p minioServerPools=2
```
This command will update the existing Kaptain instance and double up MinIO cluster capacity with almost no downtime.

## Known limitations
1. Data redundancy is only guaranteed within the single server pool - if more than a half of the drives in a pool 
are lost, the data will not be reconstructed.
2. When the MinIO cluster is expanded by adding the new server pool, the data from the initial pool will not be 
replicated/rebalanced between the existing and the new pool.
