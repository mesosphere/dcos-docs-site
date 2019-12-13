---
layout: layout.pug
title: 度量标准插件架构
navigationTitle: 度量标准插件架构
menuWeight: 0
excerpt: DC/OS 如何收集和发布度量标准
enterprise: false
---

DC/OS（1.12 版及更新版本）中的度量标准基于 [Telegraf](https://github.com/dcos/telegraf)。Telegraf 提供基于代理的服务，在 DC/OS 群集中的每个管理节点和代理节点上运行。默认情况下，Telegraf 从同一节点上运行的所有进程收集度量标准，收集的信息经过处理之后被发送到中央度量标准数据库。

Telegraf 具有插件驱动型架构。通过插件架构，Telegraf 可以从任何支持的输入插件收集信息，并将结果写入任何支持的输出插件。插件将编译成 Telegraf 二进制文件进行执行，您可以使用配置文件选项选择性启用和自定义插件。

默认情况下，DC/OS 启用以下 Telegraf 插件：

 1. `system` 输入插件收集有关节点的信息，例如 CPU、内存和磁盘使用情况。
 1. `statsd` 输入插件从 DC/OS 组件收集 `statsd` 度量标准。
 1. `prometheus` 输入插件从 DC/OS 组件和 `mesos` 任务收集度量标准。
 1. `dcos_statsd` 输入插件为每个 `mesos` 任务启动新的 `statsd` 服务器。
 1. `dcos_containers` 从 `mesos` 进程收集有关容器的资源信息。
 1. `override` 插件用于添加 **节点层级** 元数据，例如，群集名称。
 1. `dcos_metadata` 插件用于添加 **任务层级** 元数据，例如，执行器名称和任务名称。
 1. `dcos_metrics` 输出插件提供 CLI 使用的 `dcos-metrics` JSON API。
 1. `prometheus_client` 输出插件提供 Prometheus 格式的度量标准。

Telegraf 在节点上启动时，它会加载配置文件和配置目录的内容。您可以在重新启动 Telegraf 之前，通过使用适当的设置创建配置文件并将文件复制到 `/var/lib/dcos/telegraf/telegraf.d` 目录，从而指定要启用的插件。只有以 `.conf` 结尾的文件才会包含在 Telegraf 配置中。注意：配置文件中的任何错误都将阻止 Telegraf 成功启动。

Telegraf 通过为每个节点上的度量标准提供单一来源，缩减了从群集中运行的每个进程收集度量标准的复杂性。Telegraf 还将识别元数据（例如原始任务名称）添加到其收集的度量标准中，以使度量标准更易于读取。如果没有这种元数据，在 Mesos 上运行的任务的度量标准很难通过其原始容器 ID（一个较长的随机散列） 来识别。

[Telegraf 的 DC/OS 分支](https://github.com/dcos/telegraf)包括每个插件的技术文档和示例配置。
