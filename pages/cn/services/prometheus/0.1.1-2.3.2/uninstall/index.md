---
layout: layout.pug
navigationTitle: 卸载
title: 卸载
menuWeight: 40
excerpt: 卸载 DC/OS Prometheus 服务
featureMaturity:
enterprise: false
---

## DC/OS 1.10

如果您使用 DC/OS 1.10：

通过输入“dcos package uninstall”从 DC/OS CLI 卸载服务 <package_name>`.
例如，卸载名为`prometheus-dev`的 Prometheus 的实例，运行：

```

dcos package uninstall prometheus-dev

```

### 卸载流程

卸载服务包括以下步骤。调度程序在 Marathon 中重新启动，环境变量  SDK_UNINSTALL 设置为“true”。这将使调度程序处于卸载模式。

调度程序执行卸载，操作如下：

 1. 服务的所有运行任务都被终止，以便 Mesos 重新为任务提供资源。
 1. 因为任务资源由 Mesos 提供，调度程序取消保留这些资源。
 1. 所有已知资源已被取消保留之后，将删除 ZooKeeper 中调度程序的持久状态。

<p class="message--warning"><strong>警告：</strong> 保留的磁盘资源中存储的任何数据都将无法恢复。</p>

完成卸载过程之后，集群即会自动删除调度程序任务。

<p class="message--warning"><strong>警告 </strong> 卸载操作开始后不能取消，因为这可能使服务处于不确定的半销毁状态。</p>

### 调试卸载

在绝大多数情况下，此卸载过程会顺利结束。然而，在某些情况下，可能会有小问题。例如，可能集群中的一台机器永久消失，并且正在卸载的服务在该机器上分配了一些资源。这会导致卸载卡住，因为 Mesos 绝不会将这些资源提供给卸载调度程序。因此，卸载调度程序将无法成功取消保留该机器上保留的资源。

在卸载正在进行时，通过查看部署计划可发现此情况。可以使用以下任一方法查看部署计划：

- CLI：`dcos prometheus --name=prometheus plan show deploy`（必要时在运行 `dcos package install --cli prometheus` 后）
- HTTP: https://yourcluster.com/service/prometheus/v1/plans/deploy

### 手动卸载 

如果所有其他都失败，您可以自行手动执行卸载。为此，请执行以下步骤：

1. 从 Marathon 中删除卸载调度程序。
1. 按如下方式使用其 UUID 从 Mesos 中取消注册服务：

```shell
dcos service --inactive | grep prometheus
prometheus     False     3    3.3  6240.0  15768.0  97a0fd27-8f27-4e14-b2f2-fb61c36972d7-0096
dcos service shutdown 97a0fd27-8f27-4e14-b2f2-fb61c36972d7-0096
```
