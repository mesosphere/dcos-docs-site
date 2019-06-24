---
layout: layout.pug
title: 向 Prometheus 导出 DC/OS 度量标准
navigationTitle: 向 Prometheus 导出 DC/OS 度量标准
menuWeight: 5
excerpt: 通过 Prometheus 和 Grafana 自我托管实例监控工作负载
enterprise: false
---

DC/OS 1.12 默认导出 Prometheus 格式的系统、容器和应用程序度量标准。DC/OS 1.9 和 1.10 版本无需安装度量标准插件。本页面解释了如何运行自我托管 Prometheus 实例来监控工作负载，以及用于强大仪表盘和可视化的自我托管 Grafana 实例。

**先决条件：**

- 必须 [安装 DC/OS CLI](/cn/1.12/cli/install/) 并通过 `dcos auth login` 命令以超级用户身份登户。

# 在 DC/OS 上运行 Prometheus 和 Grafana

有许多方法可以运行 Prometheus 和 Grafana 堆栈。这是在 DC/OS 上使用自我托管度量标准的最简单方法。

1. 使用 `dcos package install prometheus` 安装 Prometheus 服务。
1. 使用 `dcos package install grafana` 安装 Grafana 服务。
1. 打开 DC/OS UI 并等待两个服务全都能够正常运行

# 使用 Prometheus 中的度量标准

Prometheus 服务已配置为从群集中的每个节点、Mesos 代理节点和群集中的任务获取度量标准。无需执行任何进一步配置，尽管您可以随时更新 Prometheus 服务的配置字段，添加更多数据源。

Prometheus 服务为 AlertManager、Prometheus UI 和 Pushgateway 揭示了端点。这些都显示在 `Endpoints` 选项卡中。Prometheus UI 的 URL 为 http://prometheus.prometheus.l4lb.thisdcos.directory:9090。根据群集的网络配置，您可能需要使用 [DCOS 隧道](/cn/1.12/developing-services/tunnel/) 进行访问。您可以对现有度量标准执行简单查询。

 ![prometheus_cpu_usage](/1.12/img/prometheus_cpu_usage.png)

 图 1. 系统度量标准图表

# 使用 Grafana 中的度量标准

Grafana 揭示了Grafana UI 的单个终点，该终点显示在 `Endpoints` 选项卡。Grafana UI 的 URL 为 http://grafana.grafana.l4lb.thisdcos.directory:3000。与 Prometheus 一样，您可能需要使用 `dcos tunnel` 访问 UI。

UI 的默认凭据是 `admin:admin`。

登录后，您必须执行以下任务：
- 添加数据源。
- 选择名称。
- 选择适当的数据源类型。
- 使用您用于访问 Prometheus UI 的同一 URL。
- 将所有其他字段设置为默认值。
- 点击 `Save and Test` 按钮以确保端点正常工作。

完成上述任务后，您可以使用新创建的数据源的度量标准来创建一个 Grafana 仪表盘。

 ![grafana_nodes_overview](/1.12/img/grafana_nodes_overview.png)

 图 2. Grafana 仪表板，显示系统度量标准和任务
