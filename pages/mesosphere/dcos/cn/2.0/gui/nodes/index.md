---
layout: layout.pug
navigationTitle:  节点
title: 节点
menuWeight: 5
excerpt: 使用“节点”页面
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---

“节点”部分全面展示在整个群集中使用的所有节点。此屏幕有两个选项卡，即**代理节点** 和 **管理节点**。默认情况下，您将看到 **代理节点** 选项卡。

![Nodes](/mesosphere/dcos/2.0/img/nodes-ee-dcos-1-12.png)

图 1 -“代理节点”选项卡

# 代理节点选项卡
这是默认视图。所有节点也默认显示在 **列表** 视图中，并按运行状况排序。您可以按框架或服务名称筛选此列表。

![筛选条件列表](/mesosphere/dcos/2.0/img/GUI-Nodes-Framework-Filter-Menu.png)

图 2 - 按框架筛选

如果您更喜欢更多图形显示，则单击屏幕右侧的图标，以在节点的列表视图和“甜甜圈”视图之间切换。

![Nodes](/mesosphere/dcos/2.0/img/nodes-donuts-ee-dcos-1-12.png)

图 3 - 节点“甜甜圈”视图

# 管理节点选项卡

**管理节点** 选项卡显示群集中关于管理节点的信息。可以查看群集中的领导者和非领导者，以及他们对应的 IP 和端口、区域、版本、启动时间和选举时间。

![Nodes](/mesosphere/dcos/2.0/img/nodes-masters-ee-dcos-1-12.png)

图 4 -“管理节点”选项卡


# 节点实例

单击 **主机 IP** 可打开“节点实例”页面，提供了有关节点的更多信息。您可以使用搜索框或下拉筛选器缩小列表的范围。**节点**实例页面有三个选项卡：[任务](#tasks)、[运行状况](#health) 和 [详情](#details)。默认显示 **任务** 选项卡。

## 任务

![任务选项卡](/mesosphere/dcos/2.0/img/GUI-Nodes-Tasks-Tab.png)

图 5 -“任务”选项卡

**任务** 选项卡显示以下信息：


| 名称 | 说明 |
|----------|-----------|
| ID | 此服务实例的唯一标识符。包含服务的名称（例如，`confluent-kafka` 加上配置详情。）  |
| 名称 | 此服务实例的唯一名称。包含一系列用连字符分隔的单词（例如，`data-science-engine`）。每个单词必须至少为 1 个字符，且只能包含数字 (`0-9`)、连字符 (`-`)、圆点 (`.`) 和小写字母 (`a-z`)。单词不能以连字符开头或结尾。     |
| 主机 | 此节点的 IP 地址。     |
| 分区 | 云提供商地区。     |
| 分域 | 云提供商区域。如果未定义，则会在本地区域运行。 |
| 状态 |  节点的当前状态。     |
| 运行状况 | 节点的当前运行状况。     | |
| 日志 | 单击“查看日志”图标将打开该服务实例的日志。  |
| CPU | 分配给进程的 CPU 份额数。     |
| MeM | 分配给进程的内存量，以 MB 为单位。    |
| GPU | 此节点可用的 GPU 数。    |
| 更新 | 自上次更新以来的时间，以分钟为单位。 |

右上角的垂直圆点线打开了一个菜单，让您可以排空或停用一个节点。

![停用菜单](/mesosphere/dcos/2.0/img/GUI-Nodes-Drain-Menu.png)

图 6 -“停用”菜单

有关排空节点的更多信息，请参见 [排空节点](/mesosphere/dcos/2.0/administering-clusters/draining-a-node/)。有关停用节点的更多信息，请参阅关于如何 [关闭和停用节点] 的文档(/mesosphere/dcos/2.0/administering-clusters/delete-node/)。

## 运行状况

**运行状况** 选项卡显示节点运行状况检查的状态。

![运行状况选项卡](/mesosphere/dcos/2.0/img/GUI-Nodes-Health-Tab.png)

图 7 - **节点 > 运行状况** 选项卡

您可以使用 **所有运行状况检查** 下拉菜单来筛选此列表。

![所有运行状况检查菜单](/mesosphere/dcos/2.0/img/GUI-Nodes-Health-Filter.png)

图 8 - 运行状况检查筛选器

## 详细信息

**节点 > 详情** 选项卡将显示此节点的识别信息及其状态和资源。

![详情面板](/mesosphere/dcos/2.0/img/GUI-Nodes-Details-Tab.png)

图 9 -“节点详情”选项卡

### [服务详情]

如果您点击服务的名称（例如，HDFS），您将看到 **节点 > 服务详情** 页面。这将显示关于配置、标签、Marathon 配置和运行状况检查状态的信息。

![服务详情页面](/mesosphere/dcos/2.0/img/GUI-Nodes-Services-Details.png)
 
图 10 - 服务详情

#### 文件选项卡

服务的“文件”选项卡显示工作目录，将显示此群集的名称、权限、所有者、大小和最后修改日期。

![文件选项卡](/mesosphere/dcos/2.0/img/GUI-Nodes-Services-Files.png)

图 11 -“文件”选项卡

#### 日志选项卡

如果单击 **日志** 选项卡，您将看到 DC/OS 为群集保存的日志。

![日志](/mesosphere/dcos/2.0/img/GUI-Nodes-Services-Logs.png)

图 12 - 日志

您可以按 `stderr` 和 `stdout` 筛选条件来筛选结果。要下载日志副本，请单击菜单右侧的向下箭头。

有关日志记录的完整详情，请参阅 [日志记录](/mesosphere/dcos/2.0/monitoring/logging/) 文档。您还可以在 [CLI 命令参考] 文档中找到用于日志记录的命令行界面命令(/mesosphere/dcos/2.0/cli/command-reference/dcos-node/dcos-node-log/)。

### 主机详情

如果单击主机的 IP 地址，默认情况下，您会看到“任务”视图。

![节点任务](/mesosphere/dcos/2.0/img/GUI-Nodes-Tasks-Tab.png)

图 13 - 节点任务


# CLI 等效命令

有关 **节点** 命令行界面命令的信息，请参阅 [CLI 命令参考](/mesosphere/dcos/2.0/cli/command-reference/dcos-node/) 文档。