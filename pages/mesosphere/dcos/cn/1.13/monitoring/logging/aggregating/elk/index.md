---
layout: layout.pug
navigationTitle:  使用 ELK 进行日志管理
title: 使用 ELK 进行日志管理
menuWeight: 1
excerpt: 从群集节点管理系统和应用程序日志
render: mustache
model: /mesosphere/dcos/1.13/data.yml
enterprise: false
---



您可以将 DC/OS 群集中节点的系统和应用程序日志传输到 Elasticsearch 服务器。


# 本文档涵盖和不涵盖的内容

本文档介绍了如何将 Fluent Bit 输出从每个节点发送到集中式 Elasticsearch 实例。本文档介绍如何从 Fluent Bit 直接传输到 Elasticsearch。此架构中没有使用 Logstash。如果您有兴趣筛选、解析和了解处于中间 Logstash 阶段的日志，请参阅 Logstash [文档][4] 以及 [使用 ELK 筛选日志][2] 中的示例。

本文档未介绍如何设置和配置 Elasticsearch 服务器。本文档未介绍如何在 Fluent Bit 实例和 Elasticsearch 之间建立安全的 TLS 通信。有关如何实现此操作的详细信息，请参阅 [Fluent Bit][1] 和 [Elasticsearch][3] 文档。

**前提条件**

* 现有 Elasticsearch 装置可以消化数据用于索引
*   所有 DC/OS 节点都必须能够连接到用于在 Elasticsearch 和 Fluent Bit 之间通信的端口上的 Elasticsearch 服务器（默认为 9200）
*   您自定义 Fluent Bit 配置的每个 DC/OS 节点上的位置。本教程将使用 `/etc/fluent-bit/`。

## 步骤 1：管理节点

对于 DC/OS 群集中的每个管理节点，创建一个文件 `/etc/fluent-bit/fluent-bit.conf`，其包含默认的管理节点 Fluent Bit 配置，并添加了 Elasticsearch 输出插件的配置。如需更多关于配置 Fluent Bit 以发送日志到 Elasticsearch 的信息，请参阅 [Fluent Bit 文档][1]。

```
@INCLUDE /opt/mesosphere/etc/fluent-bit/master.conf
[OUTPUT]
     Name es
     Match *
     Host <Elasticsearch host>
     Port <Elasticsearch port>
```

## 步骤 2：代理节点

对于 DC/OS 群集中的每个代理节点，创建一个文件 `/etc/fluent-bit/fluent-bit.conf`，其包含默认的管理节点 Fluent Bit 配置，并添加了 Elasticsearch 输出插件的配置。如需更多关于配置 Fluent Bit 以发送日志到 Elasticsearch 的信息，请参阅 [Fluent Bit 文档][1]。

```
@INCLUDE /opt/mesosphere/etc/fluent-bit/agent.conf
[OUTPUT]
     Name es
     Match *
     Host <Elasticsearch host>
     Port <Elasticsearch port>
```

## 步骤 3：所有节点

对于 DC/OS 群集中的所有节点：

1. 创建一个文件 `/etc/fluent-bit/fluent-bit.env`，它将 `FLUENT_BIT_CONFIG_FILE` 环境变量设置为 Fluent Bit 配置的位置：

```
FLUENT_BIT_CONFIG_FILE=/etc/fluent-bit/fluent-bit.conf
```

2. 创建一个目录 `/etc/systemd/system/dcos-fluent-bit.service.d`：

```
$ sudo mkdir -p /etc/systemd/system/dcos-fluent-bit.service.d
```

3. 创建一个将自定义配置应用到 Fluent Bit 的文件 `/etc/systemd/system/dcos-fluent-bit.service.d/override.conf`：

```
[Service]
EnvironmentFile=/etc/fluent-bit/fluent-bit.env
```

4. 重新加载系统以更新 `dcos-fluent-bit.service`，然后重新启动：

```
$ sudo systemctl daemon-reload
$ sudo systemctl restart dcos-fluent-bit.service
```

# 后续步骤

有关如何使用 ELK 筛选日志的详细信息，请参阅 [使用 ELK 筛选 DC/OS 日志][2]。

 [1]: https://docs.fluentbit.io/manual/output/elasticsearch
 [2]: ../filter-elk/
 [3]: https://www.elastic.co/guide/en/elasticsearch/reference/5.0/index.html
 [4]: https://www.elastic.co/guide/en/logstash/current/index.html
