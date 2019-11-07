---
layout: layout.pug
navigationTitle:  使用 Splunk 进行日志管理
title: 使用 Splunk 进行日志管理
menuWeight: 3
excerpt: 使用 Splunk 服务器管理系统和应用程序日志
渲染：胡须
模型：/mesosphere/dcos/1.13/data.yml
enterprise: false
---

# 概述
您可以将系统和应用程序日志从 config.yaml 群集传输到现有 Splunk 服务器。本文档介绍如何配置 Fluent Bit 以将每个节点的输出发送到 Splunk 装置。本文档未介绍如何设置和配置 Splunk 服务器。

这些说明是基于 CentOS，可能极大地不同于与其他 Linux 系统分配。

**前提条件**

* 现有 Splunk 装置可以消化数据用于索引
*   所有 DC/OS 节点必须能够通过 HTTP 或 HTTPS 连接到 Splunk 索引器
*   您自定义 Fluent Bit 配置的每个 DC/OS 节点上的位置。本教程将使用 `/etc/fluent-bit/`。

## 步骤 1：管理节点

对于 DC/OS 群集中的每个管理节点，创建一个文件 `/etc/fluent-bit/fluent-bit.conf`，其包含默认的管理节点 Fluent Bit 配置，并添加了 Splunk 输出插件的配置。如需更多关于配置 Fluent Bit 以发送日志到 Splunk 的信息，请参阅 [Fluent Bit 文档](https://docs.fluentbit.io/manual/output/splunk)。

```
@INCLUDE /opt/mesosphere/etc/fluent-bit/master.conf
[OUTPUT]
    Name splunk
    Match *
    Host <Splunk server host>
    Port <Splunk server port>
    Splunk_Token <Splunk HTTP event collector token>
```

## 步骤 2：代理节点

对于 DC/OS 群集中的每个代理节点，创建一个文件 `/etc/fluent-bit/fluent-bit.conf`，其包含默认的管理节点 Fluent Bit 配置，并添加了 Splunk 输出插件的配置。如需更多关于配置 Fluent Bit 以发送日志到 Splunk 的信息，请参阅 [Fluent Bit 文档](https://docs.fluentbit.io/manual/output/splunk)。

```
@INCLUDE /opt/mesosphere/etc/fluent-bit/agent.conf
[OUTPUT]
    Name splunk
    Match *
    Host <Splunk server host>
    Port <Splunk server port>
    Splunk_Token <Splunk HTTP event collector token>
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

有关如何使用 Splunk 筛选日志的详细信息，请参阅 [使用 Splunk 筛选日志][3]。

 [2]: http://www.splunk.com/en_us/download/universal-forwarder.html
 [3]: ../filter-splunk/
