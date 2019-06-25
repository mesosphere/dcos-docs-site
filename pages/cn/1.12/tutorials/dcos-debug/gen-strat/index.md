---
layout: layout.pug
navigationTitle: 策略
title: 策略
excerpt: 教程 - 应用故障排除策略
menuWeight: 21
---
#include /include/tutorial-disclaimer.tmpl

<a name=strategy></a>

# 一般策略：调试 DC/OS 上的应用程序部署

既然我们已经定义了 DC/OS 上调试应用程序的[工具集](/1.12/tutorials/dcos-debug/tools/)，那么让我们考虑实际在应用程序调试方案中实施这些可用工具的逐步一般故障排除策略。一旦我们完成了一般战略，我们将考虑如何在[实践部分](/1.12/tutorials/dcos-debug/scenarios/)应用此策略的一些具体方案。

除了考虑方案特有的任何信息外，调试应用部署问题的合理方法是按以下顺序应用我们的调试工具：

<a name="tools"></a>

- 1: [检查 GUI](#GUI-strat)
- 2: [检查任务日志](#task-strat)
- 3: [检查调度程序日志](#schedule-strat)
- 4: [检查代理程序日志](#agent-strat)
- 5: [交互式测试任务](#interactive-strat)
- 6: [检查管理节点日志](#master-strat)
- 7: [咨询社区](#community-strat)


<a name="GUI-strat"></a>

### 第 1 步：检查 GUI

首先检查 [DC/OS GUI] (/1.12/gui/)，或使用 CLI [检查任务的状态] (/1.12/deploying-services/task-handling/)。如果任务有关联的[运行状况检查](/1.12/deploying-services/creating-services/health-checks/)，则检查任务的运行状况也是一个好主意。

如果相关，则检查 [Mesos GUI](/1.12/tutorials/dcos-debug/tools/#mesos-ui) 或 [Exhibitor/ZooKeeper GUI](/1.12/tutorials/dcos-debug/tools/#zoo-ui)，以获取可能相关的调试信息。

<a name="task-strat"></a>

### 第 2 步：检查任务日志

如果 GUI 无法提供足够的信息，接下来请使用 DC/OS GUI 或 CLI 检查[任务日志](/1.12/tutorials/dcos-debug/tools/#task-logs)。这样能够更好地了解应用程序可能发生的情况。如果问题与我们的应用程序不部署有关（例如，任务状态继续无限期等待），请尝试查看['调试'页面](/1.12/monitoring/debugging/gui-debugging/#debugging-page)。这可能有助于了解 Mesos 提供的资源。

<a name="schedule-strat"></a>

### 第 3 步：检查调度程序日志

接下来，当存在部署问题且任务日志不提供足够的信息来修复问题时，仔细检查应用定义会很有帮助。然后，在确认应用定义后检查 Marathon 日志或 GUI，以了解它的安排方式或原因。

<a name="agent-strat"></a>

### 第 4 步：检查代理程序日志

[Mesos 代理程序日志](/1.12/tutorials/dcos-debug/tools/#mesos-agent-logs)提供有关如何启动任务和任务环境的信息。请记住，在某些情况下，增加日志级别可能有助于获取更多可用的信息。

<a name="interactive-strat"></a>

### 第 5 步：交互式测试任务

下一步是以[交互方式查看容器内运行的任务](/1.12/tutorials/dcos-debug/tools/#interactive)。如果任务仍在运行，`dcos task exec` 或 `docker exec` 可以帮助启动交互式调试会话。如果应用程序基于 Docker 容器镜像，则使用 `docker run` 和 `docker exec` 手动启动它也可以让您从正确的方向开始。

<a name="master-strat"></a>

### 第 6 步：检查管理节点日志

如果您想了解特定调度程序收到某些资源或特定状态的原因，那么[管理节点日志可能非常有用](/1.12/tutorials/dcos-debug/tools/#master-logs)。请记住，主节点转发代理程序和调度程序之间的所有状态更新，因此，在代理节点可能无法访问的情况下（例如，网络分区或节点故障）甚至可能非常有用。

<a name="community-strat"></a>

### 第 7 步：咨询社区

如上所述，(/1.12/tutorials/dcos-debug/tools/#community)通过使用 [DC/OS Slack](http://chat.dcos.io/?_ga=2.29995196.285985511.1525709518-600356888.1525372520) 或[邮件列表](https://groups.google.com/a/dcos.io/forum/#!forum/users)，[社区可能非常有用]，非常有助于进一步执行调试。
