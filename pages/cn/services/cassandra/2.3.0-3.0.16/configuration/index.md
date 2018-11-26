---
layout: layout.pug
navigationTitle: 配置
excerpt: 配置 Cassandra
title: 配置
menuweight: 20
model: /cn/services/cassandra/data.yml
render: mustache
---


#include /cn/services/include/configuration-install-with-options.tmpl
#include /cn/services/include/configuration-create-json-file.tmpl
#include /cn/services/include/configuration-service-settings.tmpl
#include /cn/services/include/configuration-regions.tmpl


## Cassandra 节点设置

调整以下设置以自定义分配给每个节点的资源量。DC/OS Apache Cassandra 的 [系统要求](http://cassandra.apache.org/doc/latest/operating/hardware.html) 在调整这些值时必须考虑。降低系统要求下的这些值，可能导致使用该服务时出现不良性能和/或故障。

以下每个设置均可在 **节点** 配置部分进行自定义。

### 节点计数

在**节点** 配置部分自定义 `Node Count` 设置（默认 3）。有关最低节点计数要求，请参阅 Apache Cassandra 文档。

* **在 DC/OS CLI options.json** 中：`count`：整数（默认： `3`）
* **DC/OS Web 界面**：`NODES`：`integer`

### CPU

您可以自定义分配给每个节点的 CPU 数量。1.0 的值等同于计算机上的一个完整专用 CPU 核心，尽管所有核心均可通过时间分片提供。通过编辑 **节点** 配置部分的 **cpus** 值来更改此值。值设置过低会导致任务受限。

请注意，每个 Cassandra 节点都会为 sidecar 服务（例如，备份和 nodetool）使用额外的 1.0 CPU。为每个 Cassandra 节点配置 3 个 CPU 时，实际使用率将为 4 个 CPU，在配置 Cassandra 时应考虑到这些，以最大化在代理上的资源利用率。

* **在 DC/OS CLI options.json** 中：`cpus`：数字（默认：`0.5`）
* **DC/OS Web 界面**：`CASSANDRA_CPUS`：`number`

### 内存

您可以自定义分配给每个节点的 RAM 量。通过编辑 **节点** 配置部分的 **mem** 值（以 MB 为单位）来更改此值。此值设置过低将导致内存不足错误。`heap.size` 设置值还必须小于此值，以防止内存不足错误，这种错误在 Java 虚拟机尝试给 Cassandra 流程分配额外的可用内存时会出现。

* **在 DC/OS CLI options.json** 中：`mem`：整数（默认： `10240`）
* **DC/OS Web 界面**：`CASSANDRA_MEMORY_MB`：`integer`

### JMX 端口

您可以自定义 Apache Cassandra 针对 JMX 请求（例如，由 `nodetool` 发出的请求）进行侦听的端口。

* **在 DC/OS CLI options.json** 中：`jmx_port`：整数（默认： `7199`）
* **DC/OS Web 界面**：`TASKCFG_ALL_JMX_PORT`：`integer`

### 存储端口

您可以自定义 Apache Cassandra 针对节点间通信进行侦听的端口。

* **在 DC/OS CLI options.json** 中：`storage_port`：整数（默认： `7000`）
* **DC/OS Web 界面**：`TASKCFG_ALL_CASSANDRA_STORAGE_PORT`：`integer`

### SSL 存储端口

您可以自定义 Apache Cassandra 针对 SSL 节点间通信进行侦听的端口。

* **在 DC/OS CLI options.json** 中：`ssl_storage_port`：整数（默认： `7001`）
* **DC/OS Web 界面**：`TASKCFG_ALL_CASSANDRA_SSL_STORAGE_PORT`：`integer`

### 本地传输端口

您可以自定义 Apache Cassandra 针对 CQL 查询进行侦听的端口。

* **在 DC/OS CLI options.json** 中：`native_transport_port`：整数（默认： `9042`）
* **DC/OS Web 界面**：`TASKCFG_ALL_CASSANDRA_NATIVE_TRANSPORT_PORT`：`integer`

### RPC 端口

您可以自定义 Apache Cassandra 针对 Thrift RPC 请求进行侦听的端口。

* **在 DC/OS CLI options.json** 中：`rpc_port`：整数（默认： `9160`）
* **DC/OS Web 界面**：`TASKCFG_ALL_CASSANDRA_RPC_PORT`：`integer`

### 磁盘

#### 卷类型

该服务支持两种卷类型：
 - `ROOT` 卷是根卷上的隔离目录，与主机系统的其余部分共享 IO /心轴。
 - `MOUNT` 卷是独立卷上的专用设备或分区，具有专用 IO/心轴。

使用 `MOUNT` 卷，需要 [每个 DC/OS 代理系统上的附加配置](/cn/1.11/storage/mount-disk-resources/)，所以服务当前使用默认的 `ROOT` 卷。为确保生产环境中可靠和稳定的性能，您应配置将在您的集群中运行服务的计算机上的 `MOUNT` 卷，然后将以下内容配置为 `MOUNT` 卷：

配置磁盘类型：
* **在 DC/OS CLI options.json** 中：`disk_type`：字符串（默认：`ROOT`）
* **DC/OS Web 界面**：`CASSANDRA_DISK_TYPE`：`string`

#### 磁盘调度器

[建议](http://docs.datastax.com/en/landing_page/doc/landing_page/recommendedSettings.html#recommendedSettings__optimizing-ssds) 您预配置您的存储主机，以在生产环境中使用截止时间 IO 调度器。

## 机架感知放置

当指定使用`@zone`键的布局约束时，将自动启用 Cassandra 的基于“机架”的故障域支持。例如，您可以通过指定约束`[["@zone", "GROUP_BY", "3"]]`，使 Cassandra 节点至少跨越三个不同的区域/机架。当使用布局约束指定 `@zone` 时，Cassandra 节点将自动通过 `rack`（匹配区域名称）进行配置。如果没有布局约束参考 `@zone` 被配置，那么所有节点都将通过 `rack1` 的默认机架进行配置。

## Apache Cassandra 配置

Apache Cassandra 的配置可通过服务架构的 `cassandra` 部分进行。有关可用配置的完整列表，请参阅服务架构。

## 多数据中心部署

要跨数据中心复制数据， {{ model.techName }} 则需要使用每个远程集群中种子节点的地址配置每个集群。以下是启用多数据中心 {{ model.techName }} 部署的情况，其在单个 DC / OS 集群内运行：

### 启动两个 Cassandra 集群

1. 使用默认配置启动第一个集群：

```shell
dcos package install {{ model.packageName }}
```

2. 为第二个集群创建 `options.json` 文件，该集群指定不同的服务名称和数据中心名称：

```json
{
  "service": {
    "name": "{{ model.serviceName }}2",
    "data_center": "dc2"
  }
}
```

3. 使用这些自定义选项启动第二个集群：
```
dcos package install {{ model.packageName }} --options=<options.json>
```

### 获取种子节点的 IP 地址

<p class="message--note"><strong>注意：</strong> 如果您的 Cassandra 集群不在同一个网络上，您必须设置代理层来路由流量。</p>

1. 为第一个集群获取种子节点地址的列表：

```shell
dcos {{ model.packageName }} --name={{ model.serviceName }} endpoints node
```

或者，您可以从调度器 HTTP API 中获取此信息：

```json
DCOS_AUTH_TOKEN=$(dcos config show core.dcos_acs_token)
DCOS_URL=$(dcos config show core.dcos_url)
curl -H "authorization:token=$DCOS_AUTH_TOKEN" $DCOS_URL/service/{{ model.serviceName }}/v1/endpoints/node
```

您的输出类似于：

```
{
  "address": [
    "10.0.1.236:9042",
    "10.0.0.119:9042"
  ],
  "dns": [
    "node-0-server.{{ model.serviceName }}.autoip.dcos.thisdcos.directory:9042",
    "node-1-server.{{ model.serviceName }}.autoip.dcos.thisdcos.directory:9042"
  ],
  "vip": "node.{{ model.serviceName }}.l4lb.thisdcos.directory:9042"
}
```

注意 `address` 字段中的 IP。

2. 对第二个 Cassandra 集群运行相同命令，并注意 `address` 字段中的 IP：

```
dcos {{ model.packageName }} --name={{ model.serviceName }}2 endpoints node
```

### 为两个集群更新配置

1. 使用第一个集群 (`{{ model.serviceName }}`) 的 IP 地址创建 `options2.json` 文件：

```json
{
  "service": {
    "remote_seeds": "10.0.1.236:9042,10.0.0.119:9042"
  }
}
```

2. 更新第二个集群的配置：

```
dcos {{ model.packageName }} --name={{ model.serviceName}}2 update start --options=options2.json
```

对第一个集群执行相同操作，在 `service.remote_seeds` 字段中创建包含第二个集群 (`{{ model.serviceName }}2`) 种子节点的 IP 地址的 `options.json`。然后，更新第一个集群的配置：`dcos {{ model.packageName }} --name={{ model.serviceName }} update start --options=options.json`。

两个调度器都将在接收到配置更新后重新启动，并且每个集群将与其他集群的种子节点通信，以建立多数据中心拓扑。对您添加的每个新集群重复执行此过程。

您可以监控第一个集群的更新进度：

```shell
dcos {{ model.packageName }} --name={{ model.serviceName }} update status
```

或者对第二个集群：

```shell
dcos {{ model.packageName }} --name={{ model.serviceName }}2 update status
```

您的输出类似于：

```shell
deploy (IN_PROGRESS)
└─ node-deploy (IN_PROGRESS)
   ├─ node-0:[server] (COMPLETE)
   ├─ node-1:[server] (COMPLETE)
   └─ node-2:[server] (PREPARED)
```

### 测试您的多数据中心配置

确保使用 Cassandra 客户端测试您的部署。
