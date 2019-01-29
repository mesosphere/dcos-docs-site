---
layout: layout.pug
navigationTitle: 运维
excerpt: 管理 Cassandra
title: 运维
menuWeight: 30
model: /cn/services/cassandra/data.yml
render: mustache
---

#include /cn/services/include/operations.tmpl

## 执行 Cassandra 清理和修复操作

您可以使用 CLI 或 HTTP API 来对 Cassandra 实例手动触发某些 `nodetool` 操作。

### 清理

您可以使用 `cleanup` 计划在 Cassandra 节点中触发 `nodetool cleanup` 操作。此计划要求运行以下参数：
- `CASSANDRA_KEYSPACE`：要清理的 Cassandra keyspace。

从命令行启动此计划：
```
dcos {{ model.packageName }} --name=<service-name> plan start cleanup -p CASSANDRA_KEYSPACE=space1
```

要从命令行查看此计划的状态：

```
dcos {{ model.packageName }} --name=<service-name> plan status cleanup
cleanup (IN_PROGRESS)
└─ cleanup-deploy (IN_PROGRESS)
├─ node-0:[cleanup] (COMPLETE)
├─ node-1:[cleanup] (STARTING)
└─ node-2:[cleanup] (PENDING)
```

计划完成后，其状态将为 `COMPLETE`。

上述 `plan start` 和 `plan status` 命令也可以通过 HTTP 直接发送给服务。要查看涉及的查询，请运行上述具有附加 `-v` 标记的命令。

如需有关 `nodetool cleanup` 的更多信息，请查阅 Cassandra 文档。

### 修复

您可以使用 `repair` 计划在 Cassandra 节点中触发 `nodetool repair` 操作。此计划要求运行以下参数：
- `CASSANDRA_KEYSPACE`：要清理的 Cassandra keyspace。

要从命令行启动此命令：
```
dcos {{ model.packageName }} --name=<service-name> plan start repair -p CASSANDRA_KEYSPACE=space1
```

要从命令行查看此计划的状态：
```
dcos {{ model.packageName }} --name=<service-name> plan status repair
repair (STARTING)
└─ repair-deploy (STARTING)
   ├─ node-0:[repair] (STARTING)
   ├─ node-1:[repair] (PENDING)
   └─ node-2:[repair] (PENDING)
```

计划完成后，其状态将为 `COMPLETE`。

上述 `plan start` 和 `plan status` 命令也可以通过 HTTP 直接发送给服务。要查看涉及的查询，请运行上述具有附加 `-v` 标记的命令。

如需有关 `nodetool repair` 的更多信息，请查阅 Cassandra 文档。

## 种子节点

Cassandra 种子节点是指指数小于种子节点计数的节点。默认情况下，Cassandra 已部署
种子节点计数为两个（节点-0 和节点-1 为种子节点）。当对这些节点执行更换操作时，
必须重新启动所有其他节点，才能更新为新种子节点的 IP 地址。该
操作自动执行。

例如，如果 `node-0` 需要更换，那么您将执行：

```bash
dcos {{ model.packageName }} --name=<service-name> pod replace node-0
```

这会导致如下恢复计划：

```bash
$ dcos {{ model.packageName }} --name=<service-name> plan show recovery
recovery (IN_PROGRESS)
└─ permanent-node-failure-recovery (IN_PROGRESS)
   ├─ node-0:[server] (COMPLETE)
   ├─ node-1:[server] (STARTING)
   └─ node-2:[server] (PENDING)
   ...
```

**注意：** 只有种子节点被放置在新节点上，所有其他节点都会被重新启动，而不会丢失数据。


## 备份和恢复

### 备份至 S3

可以使用 `backup-s3` 计划将整个集群的数据和架构备份到 Amazon S3。此计划要求运行以下参数：
- `SNAPSHOT_NAME`：此快照的名称。单个节点的快照会储存到顶层 `snapshot` 文件夹中的 S3 文件夹。
- `CASSANDRA_KEYSPACES`：要备份的 Cassandra keyspace。会按照每个指定的 keyspaces 备份整个 keyspace 及其架构。
- `AWS_ACCESS_KEY_ID`：运行此备份的 AWS IAM 用户的访问密钥 ID
- `AWS_SECRET_ACCESS_KEY`：运行此备份的 AWS IAM 用户的秘密访问密钥
- `AWS_REGION`：用于存储此备份的 S3 bucket 区域
- `S3_BUCKET_NAME`：存储此备份的 S3 bucket 的名称

确保为您的节点配置足够的磁盘空间来执行备份。Apache Cassandra 备份在上传到 S3 之前存储在磁盘上，并且占用的空间和当前表中的数据一样多，所以您需要有一半的总可用空间，以一次备份每个 keyspace。

如备份/恢复策略配置选项文档中所述，可以串行或并行传输至 S3，但必须小心不要超过集群中可能存在的任何吞吐量限制。吞吐量取决于多种因素，包括上行链路速度、与正在上传和下载备份的区域的接近度以及底层存储基础架构的性能。您应在当地环境中定期进行测试，以了解您可以从 S3 获得什么。

您可以配置快照是串行（默认）还是并行进行创建和上传。建议使用串行备份/恢复策略。

您可以从命令行启动此计划：
```
SNAPSHOT_NAME=<my_snapshot>
CASSANDRA_KEYSPACES="space1 space2"
AWS_ACCESS_KEY_ID=<my_access_key_id>
AWS_SECRET_ACCESS_KEY=<my_secret_access_key>
AWS_REGION=us-west-2
S3_BUCKET_NAME=backups
dcos {{ model.packageName }} --name=<service-name> plan start backup-s3 \
    -p SNAPSHOT_NAME=$SNAPSHOT_NAME \
    -p "CASSANDRA_KEYSPACES=$CASSANDRA_KEYSPACES" \
    -p AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
    -p AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
    -p AWS_REGION=$AWS_REGION \
    -p S3_BUCKET_NAME=$S3_BUCKET_NAME
```

如果您要备份多个 keyspace，它们必须以空格进行分隔，并在提供给 `plan start` 命令时加上引号，如上例所示。如果 `CASSANDRA_KEYSPACES` 参数未提供，那么您集群中的每个 keyspace 都将被备份。

**警告**：为确保敏感信息（例如，您的 AWS 秘密访问密钥）处于安全状态，确保您已将 DC/OS CLI 中的 `core.dcos_url` 配置属性设置到 HTTPS URL。

要从命令行查看此计划的状态：
```
dcos {{ model.packageName }} --name=<service-name> plan status backup-s3
backup-s3 (IN_PROGRESS)
├─ backup-schema (COMPLETE)
│  ├─ node-0:[backup-schema] (COMPLETE)
│  ├─ node-1:[backup-schema] (COMPLETE)
│  └─ node-2:[backup-schema] (COMPLETE)
├─ create-snapshots (IN_PROGRESS)
│  ├─ node-0:[snapshot] (STARTED)
│  ├─ node-1:[snapshot] (STARTED)
│  └─ node-2:[snapshot] (COMPLETE)
├─ upload-backups (PENDING)
│  ├─ node-0:[upload-s3] (PENDING)
│  ├─ node-1:[upload-s3] (PENDING)
│  └─ node-2:[upload-s3] (PENDING)
└─ cleanup-snapshots (PENDING)
   ├─ node-0:[cleanup-snapshot] (PENDING)
   ├─ node-1:[cleanup-snapshot] (PENDING)
   └─ node-2:[cleanup-snapshot] (PENDING)
```

上述 `plan start` 和 `plan status` 命令也可以通过 HTTP 直接发送给服务。要查看涉及的查询，请运行上述具有附加 `-v` 标记的命令。

### 备份至 Azure

您还可以使用 `backup-azure` 计划来备份至  Microsoft Azure。此计划要求运行以下参数：

- `SNAPSHOT_NAME`：此快照的名称。单个节点的快照会存储为使用 gzip 压缩的 tarball，名称为 `node-<POD_INDEX>.tar.gz`。
- `CASSANDRA_KEYSPACES`：要备份的 Cassandra keyspace。会按照每个指定的 keyspaces 备份整个 keyspace 及其架构。
- `CLIENT_ID`：运行此备份的 Azure 服务主体的客户端 ID
- `TENANT_ID`：服务主体所属租户的租户 ID
- `CLIENT_SECRET`：服务主体的秘密密钥
- `AZURE_STORAGE_ACCOUNT`：此备份将发送到的存储帐户的名称
- `AZURE_STORAGE_KEY`：与存储帐户关联的密钥
- `CONTAINER_NAME`：存储此备份的容器的名称

您可以按照与 Amazon S3 备份计划相同的方式从命令行启动此计划：
```
dcos {{ model.packageName }} --name=<service-name> plan start backup-azure \
    -p SNAPSHOT_NAME=$SNAPSHOT_NAME \
    -p "CASSANDRA_KEYSPACES=$CASSANDRA_KEYSPACES" \
    -p CLIENT_ID=$CLIENT_ID \
    -p TENANT_ID=$TENANT_ID \
    -p CLIENT_SECRET=$CLIENT_SECRET \
    -p AZURE_STORAGE_ACCOUNT=$AZURE_STORAGE_ACCOUNT \
    -p AZURE_STORAGE_KEY=$AZURE_STORAGE_KEY \
    -p CONTAINER_NAME=$CONTAINER_NAME
```

要从命令行查看此计划的状态：
```
dcos {{ model.packageName }} --name=<service-name> plan status backup-azure
backup-azure (IN_PROGRESS)
├─ backup-schema (COMPLETE)
│  ├─ node-0:[backup-schema] (COMPLETE)
│  ├─ node-1:[backup-schema] (COMPLETE)
│  └─ node-2:[backup-schema] (COMPLETE)
├─ create-snapshots (COMPLETE)
│  ├─ node-0:[snapshot] (COMPLETE)
│  ├─ node-1:[snapshot] (COMPLETE)
│  └─ node-2:[snapshot] (COMPLETE)
├─ upload-backups (IN_PROGRESS)
│  ├─ node-0:[upload-azure] (COMPLETE)
│  ├─ node-1:[upload-azure] (STARTING)
│  └─ node-2:[upload-azure] (PENDING)
└─ cleanup-snapshots (PENDING)
   ├─ node-0:[cleanup-snapshot] (PENDING)
   ├─ node-1:[cleanup-snapshot] (PENDING)
   └─ node-2:[cleanup-snapshot] (PENDING)
```

上述 `plan start` 和 `plan status` 命令也可以通过 HTTP 直接发送给服务。要查看涉及的查询，请运行上述具有附加 `-v` 标记的命令。

## 恢复

所有恢复计划都将从备份计划备份的每个 keyspace 恢复架构，并使用拍摄快照时所包含的数据填充这些 keyspace。下载和恢复备份将使用配置的备份/恢复策略。此计划假设当前集群中不存在正在恢复的 keyspace，并且如果存在任何同名的 keyspace，则将失败。

### 从 S3 进行恢复

恢复集群数据类似于进行备份。 `restore-s3` 计划假设您的数据以 `backup-s3` 所使用的格式存储在 S3 bucket 中 。恢复计划具有以下参数：
- `SNAPSHOT_NAME`：`backup-s3` 计划中的快照名称 
- `AWS_ACCESS_KEY_ID`：运行此恢复的 AWS IAM 用户的访问密钥 ID
- `AWS_SECRET_ACCESS_KEY`：运行此恢复的 AWS IAM 用户的秘密访问密钥
- `AWS_REGION`：用于存储正在恢复的备份的 S3 bucket 区域
- `S3_BUCKET_NAME`：存储备份的 S3 bucket 的名称

从命令行启动此计划：
```
SNAPSHOT_NAME=<my_snapshot>
CASSANDRA_KEYSPACES="space1 space2"
AWS_ACCESS_KEY_ID=<my_access_key_id>
AWS_SECRET_ACCESS_KEY=<my_secret_access_key>
AWS_REGION=us-west-2
S3_BUCKET_NAME=backups
dcos {{ model.packageName }} --name=<service-name> plan start restore-s3 \
    -p SNAPSHOT_NAME=$SNAPSHOT_NAME \
    -p "CASSANDRA_KEYSPACES=$CASSANDRA_KEYSPACES" \
    -p AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
    -p AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
    -p AWS_REGION=$AWS_REGION \
    -p S3_BUCKET_NAME=$S3_BUCKET_NAME
```

要从命令行查看此计划的状态：
```
dcos {{ model.packageName }} --name=<service-name> plan status restore-s3
restore-s3 (IN_PROGRESS)
├─ fetch-s3 (COMPLETE)
│  ├─ node-0:[fetch-s3] (COMPLETE)
│  ├─ node-1:[fetch-s3] (COMPLETE)
│  └─ node-2:[fetch-s3] (COMPLETE)
├─ restore-schema (IN_PROGRESS)
│  ├─ node-0:[restore-schema] (COMPLETE)
│  ├─ node-1:[restore-schema] (STARTED)
│  └─ node-2:[restore-schema] (PENDING)
└─ restore-snapshots (PENDING)
   ├─ node-0:[restore-snapshot] (PENDING)
   ├─ node-1:[restore-snapshot] (PENDING)
   └─ node-2:[restore-snapshot] (PENDING)
```

上述 `plan start` 和 `plan status` 命令也可以通过 HTTP 直接发送给服务。要查看涉及的查询，请运行上述具有附加 `-v` 标记的命令。

### 从 Azure 进行恢复

您可以使用 `restore-azure` 计划从  Microsoft Azure 进行恢复。此计划要求运行以下参数：

- `SNAPSHOT_NAME`：此快照的名称。单个节点的快照会存储为使用 gzip 压缩的 tarball，名称为 `node-<POD_INDEX>.tar.gz`。
- `CLIENT_ID`：运行此备份的 Azure 服务主体的客户端 ID
- `TENANT_ID`：服务主体所属租户的租户 ID
- `CLIENT_SECRET`：服务主体的秘密密钥
- `AZURE_STORAGE_ACCOUNT`：此备份将发送到的存储帐户的名称
- `AZURE_STORAGE_KEY`：与存储帐户关联的密钥
- `CONTAINER_NAME`：存储此备份的容器的名称

您可以按照与 Amazon S3 恢复计划相同的方式从命令行启动此计划：
```
dcos {{ model.packageName }} --name=<service-name> plan start restore-azure \
    -p SNAPSHOT_NAME=$SNAPSHOT_NAME \
    -p CLIENT_ID=$CLIENT_ID \
    -p TENANT_ID=$TENANT_ID \
    -p CLIENT_SECRET=$CLIENT_SECRET \
    -p AZURE_STORAGE_ACCOUNT=$AZURE_STORAGE_ACCOUNT \
    -p AZURE_STORAGE_KEY=$AZURE_STORAGE_KEY \
    -p CONTAINER_NAME=$CONTAINER_NAME
```

要从命令行查看此计划的状态：
```
dcos {{ model.packageName }} --name=<service-name> plan status restore-azure
restore-azure (IN_PROGRESS)
├─ fetch-azure (COMPLETE)
│  ├─ node-0:[fetch-azure] (COMPLETE)
│  ├─ node-1:[fetch-azure] (COMPLETE)
│  └─ node-2:[fetch-azure] (COMPLETE)
├─ restore-schema (COMPLETE)
│  ├─ node-0:[restore-schema] (COMPLETE)
│  ├─ node-1:[restore-schema] (COMPLETE)
│  └─ node-2:[restore-schema] (COMPLETE)
└─ restore-snapshots (IN_PROGRESS)
   ├─ node-0:[restore-snapshot] (COMPLETE)
   ├─ node-1:[restore-snapshot] (STARTING)
   └─ node-2:[restore-snapshot] (PENDING)
```

上述 `plan start` 和 `plan status` 命令也可以通过 HTTP 直接发送给服务。要查看涉及的查询，请运行上述具有附加 `-v` 标记的命令。
