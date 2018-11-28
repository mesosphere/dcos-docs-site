---
layout: layout.pug
navigationTitle: 日志记录
title: 日志记录
menuWeight: 3
excerpt: 了解 DC/OS 核心组件和服务的诊断和状态日志
beta: true
enterprise: false
---

DC/OS 集群节点生成包含诊断和状态信息的日志，用于 DC/OS 核心组件和 DC/OS 服务。

## 服务、任务和节点日志

日志记录组件提供可揭示系统日志的 HTTP API `/system/v1/logs/`。您可以使用以下 CLI 命令，访问有关 DC/OS 调度器服务（如 Marathon 或 Kafka）的信息：

```bash
dcos service log --follow <scheduler-service-name>
```

您可以通过运行此 CLI 命令来访问 DC/OS 任务日志：

```bash
dcos task log --follow <service-name>
```

您可以使用以下 CLI 命令来访问管理节点的日志：

```bash
dcos node log --leader
```

要访问代理节点的日志，请运行 `dcos node` 以获取节点的 Mesos ID，然后运行以下 CLI 命令：

```bash
dcos node log --mesos-id=<node-id>
```

您可以从 [DC/OS Web 界面]的**服务 > 服务**选项卡，下载服务的所有日志文件(/1.11/gui/)。您也可以监控 `stdout`/`stderr`。

如需更多信息，请参阅“服务和任务日志”[快速入门指南](/cn/1.11/monitoring/logging/quickstart/)。

## 系统日志

DC/OS 组件使用 `systemd-journald` 来存储其日志。要访问 DC/OS 核心组件日志，请 [为节点执行 SSH][5]，然后运行此命令以查看所有日志：

```bash
journalctl -u "dcos-*" -b
```

输入组件名，您可以查看特定 [组件] (/1.11/overview/architecture/components/) 的日志。例如，要访问 Admin Router 日志，可运行此命令：

```bash
journalctl -u dcos-nginx -b
```

您可以在 DC/OS Web 界面的**节点**选项卡上发现哪些组件不正常。

![系统健康](/cn/1.11/img/ui-system-health-logging.png)

图 1. 显示节点的系统健康状况日志

# 日志聚合

流式传输来自集群中机器的日志并非始终可行。有时您需要已发生事件的历史记录，而这需要有存储和聚合日志的方法。这些主题描述了其中一些最常见的解决方案：

- [使用 ELK 进行日志管理](/cn/1.11/monitoring/logging/aggregating/elk/)
- [使用 Splunk 进行日志管理](/cn/1.11/monitoring/logging/aggregating/splunk/)

[5]: /1.11/administering-clusters/sshcluster/
