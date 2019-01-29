---
layout: layout.pug
title: 向 Prometheus 发送 DC/OS 度量标准
menuWeight: 4.5
excerpt: 通过 Prometheus 和 Grafana 自我托管实例监控工作负载
enterprise: false
---

DC/OS 1.11 默认导出 Prometheus 度量标准。无需像在 DC/OS 1.9 和 1.10 中一样安装度量标准插件。本指南详细介绍了如何运行自我托管 Prometheus 实例来监控工作负载，以及用于强大仪表盘和可视化的自我托管 Grafana 实例。

**先决条件：**

- 必须 [安装 DC/OS CLI](/cn/1.11/cli/install/) 并通过 `dcos auth login` 命令以超级用户身份登户。

# 在 DC/OS 上运行 Prometheus 服务器

有许多方法可以运行 Prometheus 服务器。这是在 DC/OS 上使用自我托管度量标准的最简单方法。

1. 从 dcos-metrics 存储库下载三个 Marathon 配置：
   1. [metrics.json](https://raw.githubusercontent.com/dcos/dcos-metrics/master/docs/resources/metrics.json)
   1. [prometheus.json](https://raw.githubusercontent.com/dcos/dcos-metrics/master/docs/resources/prometheus.json)
   1. [grafana.json](https://raw.githubusercontent.com/dcos/dcos-metrics/master/docs/resources/grafana.json)
1. 通过 `dcos marathon pod add metrics.json` 在 Pod 中运行 Prometheus 和 Grafana。
1. 通过 `dcos marathon app add prometheus.json` 运行 Prometheus UI 代理。
1. 通过 `dcos marathon app add grafana.json` 运行 Grafana UI。
1. 打开 DC/OS UI，并等新创建的“monitoring”文件夹中的所有服务变健康。

# 使用 Prometheus 中的度量标准

通过将光标悬停在“monitoring”文件夹中 Prometheus 应用程序的上方并单击显示的链接，可以找到 Prometheus UI。此
Prometheus 服务被配置为发现集群中的所有代理节点和管理节点，并从它们那里拉取度量标准。运行
[快速入门](/cn/1.11/metrics/quickstart/) 文档中所述的 statsd-emitter 测试应用程序将能让您查询 `statsd_tester_time_uptime`，查询后应该会产生一个
与此相似的图形：

 ![statsd_tester_time_uptime](/cn/1.11/img/statsd_tester_time_uptime.png)

 图 1. Statsd 图形

# 使用 Grafana 中的度量标准

通过将光标悬停在“monitoring”文件夹中 Grafana 应用程序的上方并单击显示的链接，可以找到 Grafana UI
。在 http://localhost:9090 上添加被称为“DC/OS 度量标准”的 Prometheus 数据源，让您可以使用来自 DC/OS 的数据构建仪表盘。
