---
layout: layout.pug
navigationTitle: 度量标准
title: 度量标准
menuWeight: 100
excerpt: 了解 DC/OS 的度量标准组件
beta: false
enterprise: false
---

<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->

DC/OS （1.12 版或更高版本）中的度量标准，使用 [Telegraf](/cn/1.12/overview/architecture/components/#telegraf) 收集和处理数据。Telegraf 使用 `statsd` 进程提供采集自 DC/OS 群集主机、在这些主机上运行的容器以及在 DC/OS 上运行的应用程序的度量标准。Telegraf 与 DC/OS 实现本地集成。默认情况下，它在每个节点上以 Prometheus 格式公开来自 `port 61091` 的度量标准，并通过 DC/OS [度量标准 API](/cn/1.12/metrics/metrics-api/)以 JSON 格式公开。

## 概述
DC/OS 采集四种度量标准，如下所示：

* **系统：** DC/OS 群集中每个节点的度量标准。
* **组件：** 组成 DC/OS 的组件的度量标准。
* **容器：** 关于根据 DC/OS [通用容器运行时](/cn/1.12/deploying-services/containerizers/ucr/)或 [Docker 引擎](/cn/1.12/deploying-services/containerizers/docker-containerizer/)运行时中运行的任务进行 `cgroup` 分配的度量标准 。
* **应用程序：** 在通用容器运行时运行的任何应用程序发出的度量标准。

Telegraf 包含在 DC/OS 分布中，并在群集中的每个主机上运行。由于 Telegraf 提供了插件驱动的架构，自定义 DC/OS 插件提供了 DC/OS 工作负载及其本身的性能度量标准。Telegraf 通过 `statsd` 进程收集应用程序和自定义度量标准。为每个新任务启动专用的 `statsd` 服务器。`statsd` 服务器收到的任何度量标准都标有任务名称及其服务名称。服务器的地址由环境变量（`STATSD_UDP_HOST` 和 `STATSD_UDP_PORT`）提供。

有关 DC/OS 自动收集的度量标准列表的详细信息，请阅读 [度量标准参考](/cn/1.12/metrics/reference/) 文档。

## 升级 1.11 版本
DC/OS 1.12 包括更新的 `statsd` 服务器，用于执行应用程序度量标准。`statsd` 更新修复了 1.11 中 `statsd` 服务器执行的问题，该问题不考虑 `statsd` 类型，将所有应用程序度量标准都视为计量指标。

依靠计数器、直方图或数集的仪表板和告警在 1.12 中的表现和在 1.11 中不同，如下所示：
- 指标报告最后接收的值。1.11 功能没有变化。
- 计数器报告所有接收值的总和。在 1.11 中，计数器报告了最后接收的值。
- 直方图和计时器报告 `_sum`、`_min` 和 `_max` 度量标准。在 1.11 中，直方图报告最后接收的值。
- 设置报告所有唯一值的总和。在 1.11 中，设置报告最后接收的值。

此外，现在还可以使用多数据包度量标准和采样。在 1.11 中，他们未获执行，从而导致缺少度量标准。

## 故障排除
使用以下故障排除指南解决错误：

- 可以通过启用 `inputs.internal` 插件来收集有关 Telegraf 自身性能的度量标准。
- 可以通过运行 `systemctl status dcos-telegraf` 来检查 Telegraf `systemd` 设备的状态。
- 可以通过 `journalctl -u dcos-telegraf` 从 journald 获得日志。
