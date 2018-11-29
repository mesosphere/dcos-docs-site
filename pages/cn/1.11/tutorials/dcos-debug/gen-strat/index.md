---
layout: layout.pug
navigationTitle: 策略
title: 策略
excerpt: 教程 - 应用故障排除策略
menuWeight: 21
---
<!-- III. Strategy Section -->

<a name=strategy></a>

# 一般策略：调试 DC/OS 上的应用程序部署

既然我们已经定义了 [DC/OS 上调试应用程序的工具集](#tools)，那么让我们考虑实际在应用程序调试方案中实施这些工具的分步的一般故障排除策略。一旦我们完成了一般战略，我们将考虑如何在[实践部分](/cn/1.11/tutorials/dcos-debug/scenarios/)应用此策略的一些具体方案。

除了考虑方案特有的任何信息外，调试应用部署问题的合理方法是按以下顺序应用[我们的调试工具](#tool)：

- 1: [检查 Web 界面](#GUI-strat)
- 2: [检查任务日志](#task-strat)
- 3: [检查调度程序日志](#schedule-strat)
- 4: [检查代理程序日志](#agent-strat)
- 5: [测试任务交互](#interactive-strat)
- 6: [检查管理节点日志](#master-strat)
- 7: [咨询社区](#community-strat)


<a name="GUI-strat"></a>

### 第 1 步：检查 Web 界面

首先检查 [DC/OS Web 界面](#dcos-ui)（或使用 CLI）以[检查任务的状态](/latest/deploying-services/task-handling/)。如果任务有关联的[运行状况检查](/latest/deploying-services/creating-services/health-checks/)，则建议检查任务的运行状况。

如果可能相关，则检查 [Mesos Web 界面](/cn/1.11/tutorials/dcos-debug/tools/#mesos-ui) 或 [Exhibitor/ZooKeeper Web 界面](/cn/1.11/tutorials/dcos-debug/tools/#zoo-ui)，以获取可能相关的调试信息。

<a name="task-strat"></a>

### 第 2 步：检查任务日志

如果 Web 界面无法提供足够的信息，接下来请使用 DC/OS Web 界面或 CLI 检查[任务日志](/cn/1.11/tutorials/dcos-debug/tools/#task-logs)。这有助于更好地了解应用程序可能发生的情况。如果问题与我们的应用程序没有部署有关（例如，任务状态继续无限期等待），请尝试查看['调试'页面](/cn/1.11/monitoring/debugging/gui-debugging/#debugging-page)。这可能有助于更好地了解 Mesos 提供的资源。

<a name="schedule-strat"></a>

### 第 3 步：检查调度程序日志

接下来，当存在部署问题且任务日志不提供足够的信息来修复问题时，仔细检查应用定义会很有帮助。然后，在确认应用定义后检查 Marathon 日志或 Web 界面，以更好地了解它的安排方式或原因。

<a name="agent-strat"></a>

### 第 4 步：检查代理程序日志

[Mesos 代理程序日志](/cn/1.11/tutorials/dcos-debug/tools/#mesos-agent-logs)提供有关如何启动任务和任务环境的信息。请记住，在某些情况下，增加日志级别可能有助于获取更多可用的信息。

<a name="interactive-strat"></a>

### 第 5 步：测试任务的交互

下一步是以[交互方式查看容器内运行的任务](/cn/1.11/tutorials/dcos-debug//tools/#interactive)。如果任务仍在运行，`dcos task exec` 或 `docker exec` 可以帮助启动交互式调试会话。如果应用程序基于 Docker 容器镜像，则使用 `docker run` 和 `docker exec` 手动启动它也可以让您以正确的方向开始操作。

<a name="master-strat"></a>

### 第 6 步：检查管理节点日志

如果您想了解特定调度程序收到某些资源或特定状态的原因，那么[管理节点日志可能非常有用](/cn/1.11/tutorials/dcos-debug/tools/#master-logs)。请记住，管理节点转发代理程序和调度程序之间的所有状态更新，因此，在代理节点可能无法访问的情况下（例如，网络分区或节点故障）甚至可能非常有用。

<a name="community-strat"></a>

### 第 7 步：咨询社区

如上所述，通过使用 [DC/OS Slack](http://chat.dcos.io/?_ga=2.29995196.285985511.1525709518-600356888.1525372520) [邮件列表](https://groups.google.com/a/dcos.io/forum/#!forum/users) 中阅读[社区可能非常有用](/cn/1.11/tutorials/dcos-debug/tools/#community) 对进一步调试非常有帮助。
