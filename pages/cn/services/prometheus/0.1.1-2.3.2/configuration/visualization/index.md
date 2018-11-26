---
layout: layout.pug
navigationTitle: 可视化
title: Grafana 和 Prometheus Expression 浏览器
menuWeight: 45
excerpt: DC/OS Prometheus Expression 浏览器
featureMaturity:
enterprise: false
---


# 可视化
 1. DC/OS Grafana
 1. DC/OS Prometheus 表达式浏览器

### DC/OS Grafana：

 DC/OS Grafana 支持 Prometheus 进行仪表板和查询功能。

### 先决条件

- 从 DC/OS 目录或 CLI 安装 Grafana。
- 从 DC/OS 目录或 CLI 安装 Prometheus 服务。
- 在您进一步操作之前，确保您的 Prometheus 服务和 Grafana 服务已启动和运行。


### 访问 Grafana 并创建 Prometheus 数据源：

### 创建 Prometheus 数据源：

1. 使用 `http://<public ip of your cluster>:13000` 导航至 Grafana 网站

1. 使用默认登录“admin”/“admin”登录。

1. 单击 Grafana 徽标打开侧边栏菜单。

1. 单击侧边栏中的“数据源”。

1. 单击“新增”。

1. 选择“Prometheus”作为类型。

1. 设置适当的 Prometheus 服务器端点（例如，http://prometheus.prometheus.14lb.thisdcos.directory:9090）

1. 根据需要调整其他数据源设置（例如，关闭代理访问）。

1. 单击“添加”保存新数据源。

### 创建 Prometheus 图表

1. 单击 **Home -> Dashboard -> New Dashboard -> Panel Title -> Edit**。更改面板标题和描述。
1. 在“度量标准”选项卡下，选择您的 Prometheus 数据源（右下方）。
1. 在“查询”字段中输入任何 Prometheus 表达式，使用“度量标准”字段以通过自动完成查找度量标准。
1. 要格式化时间序列的图例名称，请使用“图例格式”输入。

### Prometheus 表达式浏览器

 DC/OS Prometheus 服务具有一个可从集群外访问的表达式浏览器。表达式浏览器在 Prometheus 服务器上的 `/graph`可用，允许您输入任何表达式，并在表格或图表中随时间查看结果。

这主要用于即席查询和调试。Prometheus 表达式浏览器应通过 [Edge-LB] 访问(/services/edge-lb/)。
