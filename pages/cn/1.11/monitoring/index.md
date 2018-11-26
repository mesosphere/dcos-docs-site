---
layout: layout.pug
navigationTitle: 监控、日志记录和调试
title: 监控、日志记录和调试
menuWeight: 110
excerpt: 了解如何通过 DC/OS 监控数据中心运行的健康状况
---


监控构成 DC/OS 的所有部件的健康状况对数据中心操作员和排除难以诊断的漏洞都至关重要。您可以从 DC/OS Web 界面组件健康状况页面，监控集群组件的健康状况。组件健康状况页面显示来自系统健康 API 的信息，后者监控核心 DC/OS 组件。

DC/OS 组件是构成 DC/OS 核心的 [`systemd` 单元](https://www.freedesktop.org/wiki/Software/systemd/)。这些组件由我们的内部诊断实用工具 (`dcos-diagnostics.service`) 进行监控。此实用程序扫描所有 DC/OS 单元，然后揭示每个主机上的 HTTP API。有关 DC/OS 组件的完整说明，请参阅 [文档](/cn/1.11/overview/architecture/components/)。组件健康状况页面提供 systemd 中运行的所有 DC/OS 系统组件的健康状况。您可以按健康状况、主机 IP 地址或特定 systemd 进行深入查看。

## 入门

启动 [DC/OS Web 界面](/cn/1.11/gui/) 并导航到**系统 -> 组件**页面。您可以按健康状况对组件进行排序。

![系统健康](/cn/1.11/img/component-system-view.png)

图 1. 显示健康状况的组件页面

您可以单击 DC/OS 组件以查看详细信息，包括角色、节点和健康状况。

![节点详情](/cn/1.11/img/component-node-detail.png)

图 2. 单个组件的详细信息

通过点击节点查看组件 `journald`（日志）输出，您可以进一步调试。

![日志](/cn/1.11/img/component-node-output.png)

图 3：`Journald` 日志输出

## 健康状态

可能的健康状态为不健康和健康。我们可以从代码 0 和 1 中推断出来。

* **健康** 所有集群节点均健康。单元已加载但不处于“活跃”或“不活跃”状态。
* **不健康** 一个或多个节点存在问题。单元未加载或者处于“活跃”或“不活跃”状态。

系统健康 API 有四个可能的状态：0 - 3, OK（良好）；CRITICAL（严重）； WARNING（警告）；UNKNOWN（未知）。

## 系统健康 HTTP API 端点

系统健康端点通过管理节点上的 DC/OS 诊断实用程序展示：

```bash
curl --unix-socket /run/dcos/dcos-diagnostics.sock http://localhost/system/health/v1
```

## 聚合

集群健康端点的聚合通过管理节点上的相同诊断应用程序完成。您可以通过对集群中的任何管理节点进行几个查询来进一步了解此 API：

1. 对到管理节点执行 SSH：

    ```bash
    dcos node ssh --master-proxy --leader
    ```
1. 运行此命令以打开 root 会话：

    ```bash
    sudo su -
    ```
1. 运行以下命令以获得集群健康状况：

 - 系统健康状况（按单元）：

       ```bash
       curl --unix-socket /run/dcos/dcos-diagnostics.sock http://localhost/system/health/v1/units
       ```
 - 系统健康状况（按节点）：

       ```bash
       curl --unix-socket /run/dcos/dcos-diagnostics.sock http://localhost/system/health/v1/nodes
       ```
 - 系统健康状况报告：

       ```bash
       curl --unix-socket /run/dcos/dcos-diagnostics.sock http://localhost/system/health/v1/report
       ```

DC/OS 用户界面使用这些聚合端点生成您在系统健康状况控制台浏览的数据。

## 已知问题

### 错误解释按单元的系统健康状况

您可以按 `systemd` 单元对系统健康状况进行整理。不过，此搜索可能会带来误导性信息，因为服务本身可能是健康的，但运行其的节点不健康 。这表现为一项显示“健康”的服务，但与该服务相关的节点显示为“不健康”。

### 缺少集群主机

系统健康 API 依靠 Mesos-DNS 来了解所有集群主机。它通过结合来自 `mesos.master` A 记录的查询以及 `leader.mesos:5050/slaves` 来找到这些主机，以获取集群中主机的完整列表。此系统有一个已知的漏洞，如果 Mesos 代理节点的服务不健康，代理节点将不会出现在从 `leader.mesos:5050/slaves` 返回的列表中。这意味着系统健康 API 不会显示此主机。如果您遇到这种运行状态，最有可能是缺失的主机上的 Mesos 代理节点服务不健康。

## 故障排除

如果您有任何问题，您可以通过对 Mesos 领导管理节点执行 SSH 和查看诊断组件 (`dcos-d3t.service`) 的 `systemd` 状况，来检查诊断服务是否在运行。

 [4]: https://www.freedesktop.org/wiki/Software/systemd/
 [5]: http://erlang.org/doc/man/epmd.html
 [6]: /1.11/security/
 [7]: /1.11/networking/load-balancing-vips/
 [8]: /1.11/overview/concepts/#private-agent-node
 [9]: /1.11/overview/concepts/#public-agent-node
 [10]: http://mesos.apache.org/documentation/latest/persistent-volume/
