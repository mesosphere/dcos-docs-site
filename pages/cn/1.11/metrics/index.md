---
layout: layout.pug
navigationTitle: 度量
title: 度量
menuWeight: 100
excerpt: 了解 DC/OS 的度量组件
beta: false
enterprise: false
---

<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->

[度量组件](/cn/1.11/overview/architecture/components/#dcos-metrics) 从 DC/OS 集群主机和在这些主机上运行的容器，以及从在 DC/OS 上运行的向 Mesos 度量模块发送 StatsD 度量的应用程序提供度量。度量组件与 DC/OS 本身集成，可从 `/system/v1/metrics/v0` HTTP API 端点按主机获得。

## 概述
DC/OS 提供以下类型的度量：

* **主机：** - 关于特定节点（DC/OS 集群一部分）的度量。
* **容器：** - 关于根据 DC/OS [通用容器运行时](/cn/1.11/deploying-services/containerizers/ucr/) 或 [Docker 引擎](/cn/1.11/deploying-services/containerizers/docker-containerizer/) 运行时中运行的任务进行 cgroup 分配的度量 。
* **应用程序：** - 关于在通用容器运行时内运行的特定应用程序的度量。

[度量 API](/cn/1.11/metrics/metrics-api/) 揭示了这些方面。

DC/OS 度量组件在端口 61091 生成 Prometheus 度量，从而无需运行以前版本 DC/OS 支持的 Prometheus 插件。

所有三个度量层都由作为 DC/OS 分发之一部分发送的收集器聚合。这样使得度量可以在集群中的每个主机上运行。它是度量生态系统的主要入口，聚合 Mesos 度量模块向其发送的度量，或收集其运行所在机器上主机和容器级别的度量。

Mesos 度量模块与集群中的每个代理节点绑定。此模块能让在 DC/OS 之上运行的应用程序向收集器发布度量，方法是揭示每个容器内部 StatsD 主机和端口环境变量。这些度量附加有结构化数据，如 `agent-id`、`framework-id` 和 `task-id`。DC/OS 应用程序通过环境变量发现端点 (`STATSD_UDP_HOST` 或 `STATSD_UDP_PORT`）。应用程序利用此 StatsD 界面向系统发送自定义分析度量。

有关收集哪些度量的更多信息，请参阅 [度量参考](/cn/1.11/metrics/reference/)。
