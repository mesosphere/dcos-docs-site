---
layout: layout.pug
title: 工具
excerpt: 教程 - 用于调试 DC/OS 上应用程序的工具
menuWeight: 11
---
<!-- II. Tools Section -->

<a name="tools"></a>


DC/OS 附带多个与应用程序调试相关的工具：

- [DC/OS Web 界面](#dcos-web)

- [日志](#logs)

- [度量标准](#metrics)

- [调试任务交互](#interactive)

- [HTTP 端点](#endpoints)

- [社区](#community-tool)

- [其他工具](#other-tools)

<a name="dcos-web"></a>

## DC/OS Web 界面

DC/OS 为各种组件提供许多 Web 界面，尤其是在调试应用程序部署问题时：

- [DC/OS Web 界面](#dcos-ui)

- [Mesos Web 界面](#mesos-ui)

- [Zookeeper/Exhibitor Web 界面](#zoo-ui)

<a name="dcos-ui"></a>

### DC/OS Web 界面

**DC/OS Web 界面** 是开始调试的绝佳地方，因为它提供了对以下内容的快速访问：

- **集群资源分配**，以提供可用集群资源的概述
- **任务日志**，以提供对任务故障的深入了解
- **任务调试信息**，以提供关于最近任务邀约的信息和/或任务未启动的原因

![DC/OS Web 界面图片](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-21.png)

图 1. 任务调试界面

<a name="mesos-ui"></a>

### Mesos Web 界面

DC/OS Web 界面显示调试所需的大部分信息。但是，更进一步并访问 Mesos Web 界面可能很有帮助 -- 尤其是在检查失败的任务或注册框架时。Mesos Web 界面可通过 `https://<cluster-address>/mesos`。

![Mesos Web 界面图片](https://mesosphere.com/wp-content/uploads/2018/04/Screen-Shot-2018-04-15-at-17.56.16.png)

图 2. Mesos Web 界面

<a name="zoo-ui"></a>

### ZooKeeper Web 界面

由于大部分集群和框架状态存储在 Zookeeper 中，因此使用 ZooKeeper/Exhibitor Web 界面检查这些状态有时会很有帮助。Marathon、Kafka 和 Cassandra 等框架使用 Zookeeper 存储信息，因此在调试此类框架时，此资源尤为有用。例如，卸载其中一个框架时出现故障可能会留下条目。因此，当然如果您在重新安装之前卸载的框架时遇到困难，检查此 Web 界面可能非常有用。您可通过 `https://<cluster-address>/exhibitor` 查看状态。

![ZooKeeper/Exhibitor Web 界面图片](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-13.png)

图 3. ZooKeeper/Exhibitor Web 界面

<a name="logs"></a>

## 日志

日志是用于查看事件及其出现之前发生的条件的有用工具。通常，日志包含错误消息，可以提供有关错误原因的有用信息。由于日志记录本身就是一个重要的主题，因此我们建议使用 [DC/OS 日志文档](/cn/1.11/monitoring/logging/#system-logs)，以了解更多信息。

DC/OS 有许多不同的日志源。通常，这些是应用程序调试最有用的日志：

- [任务/应用程序日志](#task-logs)
- [服务调度程序日志](#scheduler-logs)（例如，Marathon）
- [Mesos 代理节点日志](#agent-logs)
- [Mesos 管理节点日志](#master-logs)
- [系统日志](#system-logs)

在 DC/OS 中，有多个选项用于访问这些日志：**DC/OS Web 界面** **DC/OS CLI** 或 HTTP 端点。此外，DC/OS 默认循环日志，以防止利用所有可用磁盘空间。

**注意：**需要可扩展的方式来管理和搜索日志吗？ 为[日志聚合和筛选构建 ELK 堆栈](/cn/1.11/monitoring/logging/aggregating/filter-elk/)可能是值得的。

有时提高临时写入日志的详细程度很有用，为调试获得更详细的故障排除信息。对于大多数组件，可通过访问端点来完成。例如，如果要在服务器接收 API 调用后将 [Mesos 代理节点的日志级别](http://mesos.apache.org/documentation/latest/endpoints/logging/toggle/)提高 5 分钟，则可以执行以下简单的两步过程：

##### 连接到管理节点

```bash
$ dcos node ssh --master-proxy --leader
```

##### 提高 Mesos 代理节点 10.0.2.219 上的日志级别

```bash
$ curl -X POST 10.0.2.219:5051/logging/toggle?level=3&duration=5mins
```

<a name="task-logs"></a>

### 任务/应用程序日志

任务/应用程序日志通常有助于了解有问题的应用程序的状态。默认情况下，应用程序日志将写入（以及执行日志）到任务工作目录中的 `STDERR` 和 `STDOUT` 文件。查看 DC/OS Web 界面中的任务时，您只需查看如下所示的日志。

![任务日志图片](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-16.png)

图 4. 任务日志

您也可以从 DC/OS CLI 执行相同操作：

```bash
$ dcos task log --follow <service-name>
```

<a name="scheduler-logs"></a>

### 调度程序/Marathon 日志

[马拉松](https://mesosphere.github.io/marathon/) 在启动应用程序时是 DC/OS 的默认调度程序。调度程序日志，特别是 Marathon 日志，是一个很好的信息来源，可帮助您了解哪些节点上安排（或不安排）某些事情的原因或方式。调用调度程序将任务与可用资源匹配。因此，由于调度程序还接收任务状态更新，所以日志还包含任务失败的详细信息。

您可以通过 DC/OS Web 界面中找到的服务列表或通过以下命令检索和查看有关特定服务的调度程序日志：

```bash
$ dcos service log --follow <scheduler-service-name>
```

请注意，由于 Marathon 是 DC/OS 的“Init”系统，因此它作为 SystemD 单元（相对于其他 DC/OS 系统组件是相同的）运行。由于这个原因，您需要 CLI 命令来访问其日志。

<a name="agent-logs"></a>

### Mesos 代理节点日志

Mesos 代理节点日志有助于了解代理节点启动应用程序的方式，以及它可能如何发生故障。您可以通过导航至 `https://<cluster_name>/mesos` 并检查代理日志来启动 Mesos Web 界面，如下所示。

![Mesos 代理节点 UI 图片](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-23.png)

图 5. Mesos 代理节点界面

或者，您可以首先使用 `dcos node log --mesos-id=<node-id>` from the DC/OS CLI to locate the corresponding node `ID` 来查找代理日志，以找到相应的节点 ID。输入：

```bash
$ dcos node
```

您将看到类似于以下输出的内容：

```bash
HOSTNAME        IP                         ID                    TYPE

10.0.1.51    10.0.1.51   ffc913d8-4012-4953-b693-1acc33b400ce-S3  agent

10.0.2.50    10.0.2.50   ffc913d8-4012-4953-b693-1acc33b400ce-S1  agent

10.0.2.68    10.0.2.68   ffc913d8-4012-4953-b693-1acc33b400ce-S2  agent

10.0.3.192   10.0.3.192  ffc913d8-4012-4953-b693-1acc33b400ce-S4  agent

10.0.3.81    10.0.3.81   ffc913d8-4012-4953-b693-1acc33b400ce-S0  agent

master.mesos.  10.0.4.215    ffc913d8-4012-4953-b693-1acc33b400ce   master (leader)
```

然后，在本例中，您可以输入：

```bash
$ dcos node log --mesos-id=ffc913d8-4012-4953-b693-1acc33b400ce-S0 --follow
```

并获取以下日志输出：

```bash
2018-04-09 19:04:22: I0410 02:38:22.711650  3709 http.cpp:1185] HTTP GET for /slave(1)/state from 10.0.3.81:56595 with User-Agent='navstar@10.0.3.81 (pid 3168)'

2018-04-09 19:04:24: I0410 02:38:24.752534  3708 logfmt.cpp:178] dstip=10.0.3.81 type=audit timestamp=2018-04-10 02:38:24.752481024+00:00 reason="Valid authorization token" uid="dcos_net_agent" object="/slave(1)/state" agent="navstar@10.0.3.81 (pid 3168)" authorizer="mesos-agent" action="GET" result=allow srcip=10.0.3.81 dstport=5051 srcport=56595
```

<a name="master-logs"></a>

### Mesos 管理节点日志

Mesos 管理节点负责将可用资源与调度程序匹配。它还将任务状态更新从 Mesos 代理节点转发到相应的调度程序。这使 Mesos 管理节点日志成为了解集群整体状态的一个很好的资源。

请注意，单个集群通常有多个 Mesos 管理节点。因此，您应该**确定当前主导的 Mesos 管理节点以获得最新日志**。事实上，在某些情况下，从另一个 Mesos 管理节点检索日志甚至是有意义的：例如，管理节点发生故障并且您想要了解原因。

您可以通过从 Mesos Web 界面检索管理节点日志，通过<cluster-name>/mesos`, via `dcos node log --leader`, or for a specific master node using `ssh master` and `journalctl -u dcos-mesos-master` 进行。

<a name="system-logs"></a>

### 系统日志

我们现在已经介绍了 DC/OS 环境中最重要的日志源，但可用的日志还有很多。每个 DC/OS 组件都写入一个日志。如上所述，[每个 DC/OS 组件](/cn/1.11/overview/architecture/components/) 作为一个 Systemd 单元运行。您可以在特定节点上通过 SSH 进入节点[直接检索日志](/latest/monitoring/logging/#system-logs)，然后键入 `journalctl -u <systemd-unit-name>`. Two of the more common system units to consider during debugging (besides Mesos and Marathon) are the `docker.service` and the `dcos-exhibitor.service`。

例如，考虑 Mesos 代理节点`ffc913d8-4012-4953-b693-1acc33b400ce-S0`上 docker 守护程序的系统单元（重新调用 `dcos node` 命令检索 Mesos ID）。

首先，我们可以使用相应的 SSH 密钥通过 SSH 进入该代理节点：

```bash
$ dcos node ssh --master-proxy --mesos-id=ffc913d8-4012-4953-b693-1acc33b400ce-S0
```

然后我们可以使用 `journatlctl`，以查看 Docker 日志：

```bash
$ journalctl -u docker
```

输出类似这样的内容：

```bash
-- Logs begin at Mon 2018-04-09 23:50:05 UTC, end at Tue 2018-04-10 02:52:41 UTC. --

Apr 09 23:51:50 ip-10-0-3-81.us-west-2.compute.internal systemd[1]: Starting Docker Application Container Engine...

Apr 09 23:51:51 ip-10-0-3-81.us-west-2.compute.internal dockerd[1262]: time="2018-04-09T23:51:51.293577691Z" level=info msg="Graph migration to content-addressability took 0.00 seconds"
```

<a name="metrics"></a>

## 度量

度量数据非常有用，因为它们有助于在潜在问题成为实际错误之前识别它们。例如，想象一个容器耗尽所有已分配内存的情况。如果您在容器处**仍在运行但尚未被终止**时检测到这一点，那么您更有可能及时进行干预。

在 DC/OS 中，度量标准有三个主要端点：

- [DC/OS 度量标准](https://github.com/dcos/dcos-metrics)
 - 端点暴露来自任务/容器、节点和应用程序的组合度量标准
- [Mesos 度量标准](http://mesos.apache.org/documentation/latest/monitoring/)
 - 端点暴露特定于 Mesos 的度量标准
- [Marathon 度量标准](https://mesosphere.github.io/marathon/docs/metrics.html)
 - 端点暴露特定于 Marathon 的度量标准

利用度量数据来帮助调试的一种方法是设置仪表盘。此仪表盘将包括与您要监控的服务相关的最重要度量数据。例如，您可以[使用 prometheus 和 grafana](https://github.com/dcos/dcos-metrics/blob/master/docs/quickstart/prometheus.md#dcos-metrics-with-prometheus-and-grafana) 创建度量仪表盘。

理想情况下，配置仪表盘并运行后，您可以在潜在问题成为实际错误之前识别它们。此外，当出现问题时，此类仪表盘在确定错误原因方面非常有帮助（例如，可能集群没有可用资源）。上面列出的端点项中的每个链接都提供了您应监控该端点的度量数据的建议。

<a name="interactive"></a>

## 交互式

有时，任务日志提供的帮助不足。在这些情况下，使用您最倾向的 Linux 工具（例如 `curl`、`cat`、`ping` 等）来获得交互式视角可能是一个值得做的步骤。

例如，如果您使用 [Universal Container Runtime (UCR)] (https://docs.mesosphere.com/latest/deploying-services/containerizers/ucr/)，则可以使用 `dcos task exec`，如下所示：

```bash
dcos task exec -it <mycontainerid>
```

并且在该容器内有一个交互式 bash shell。

**注意** 如果您在以上述方式使用 `dcos task exec` 时更改容器的状态，则必须更新存储的 `app-definition` 并从更新的 `app-definition` 重新启动容器。如果您未能执行此操作，那么您的更改将在下次重新启动容器时丢失。

或者，当使用 docker 容器化工具时，您可以通过 SSH 连接到相关节点并运行 [`docker exec`](https://docs.docker.com/engine/reference/commandline/exec/) 来调查正在运行的容器。

<a name="endpoints"></a>

## HTTP 端点

DC/OS 具有大量可用于调试的其他端点：

- `<cluster>/mesos/master/state-summary`

### `state-summary`

[`state-summary` 端点](http://mesos.apache.org/documentation/latest/endpoints/master/state-summary/) 返回集群内代理节点、任务和框架的 json 编码摘要。在考虑跨集群分配资源时，这尤其有用，因为它显示是否已为特定角色保留了资源（在[下文提供的调试方案之一](#c2)中有更多详细信息）。

**注意** 请参阅 [Mesos 端点的完整列表](http://mesos.apache.org/documentation/latest/endpoints/)。

### `queue`

- `<cluster>/marathon/v2/queue`

Marathon [`queue` 端点](https://mesosphere.github.io/marathon/api-console/index.html) 返回队列中要由 Marathon 调度的所有任务的列表。此端点在排除扩展或部署问题时非常重要。

<a name="community-tool"></a>

## 社区

[DC/OS 社区](https://dcos.io/community/?_ga=2.183442662.1394567794.1525106895-1279864600.1520288020)是通过 [Slack](http://chat.dcos.io/?_ga=2.183442662.1394567794.1525106895-1279864600.1520288020) 或 [邮寄列表](https://groups.google.com/a/dcos.io/forum/#!forum/users) 提出其他问题的好地方。同时记住，除了 DC/OS 社区之外，[Mesos](http://mesos.apache.org/community/) 和 [Marathon](https://mesosphere.github.io/marathon/support.html) 都有自己的社区。

<a name="other-tools"></a>

## 其他工具

还有其他调试工具 -- [DC/OS 内部](/cn/1.11/monitoring/debugging/) 以及 [Sysdig](https://sysdig.com/blog/monitoring-mesos/) 或 [Instana](https://www.instana.com/) 等外部工具。这些工具对确定非 DC/OS 特定问题（例如，Linux 内核或网络问题）尤为有用。
