---
layout: layout.pug
navigationTitle: 故障排除 
title: etcd 故障排除 
excerpt: 诊断 etcd 集群
menuWeight: 80
---



# 故障排除 `etcd`

DC/OS Kubernetes 包的长度很大，以确保
 `etcd` 集群遇到故障时也能正确运行。但是，不可能
预见并缓解所有可能的情况，并且在某些情况下，
可能需要终端用户的手动干预。例如，如果 `etcd` 进程
在实际与其他成员建立连接之前，就已经
被加入到现有的集群崩溃之中，那么集群可能变得不稳定，
或者，在某些情况下，变得不可操作。本文档提供了一些
最佳方案，有助于降低永久性丢失 `etcd`
集群和相关数据的几率。我们建议您在阅读本文档之前先
熟悉 [灾难恢复](../disaster-recovery) 文档。

## 故障场景

有四种主要故障场景可能导致
一个 `etcd` 由 DC/OS Kubernetes 创建和管理的集群出现永久性故障：

1. **（场景 1）** 首次创建集群时（例如，在首次安装
 DC/OS Kubernetes 时）；
1. **（场景 2）** 对集群进行扩展时（即更新值
   `kubernetes.high_availability`);
1. **（场景 3）** 当 `kubernetes.high_availability` 是 `false` 以及
 单个成员崩溃时（例如，当成员运行的 DC/OS 代理
 永久故障时）；
1. **（场景 3）** 当 `kubernetes.high_availability` 是 `true` 以及一个或
 多个成员崩溃时（例如，当 DC/OS 集群发生重大中断时）。

### 场景 1

第一个场景涉及首次安装
 DC/OS Kubernetes 时可能出现的故障。这风险较低，由于没有数据预先
存储于 `etcd`，因此可能没有数据丢失。

在此场景中，当任何 `etcd` 成员（任务）无法启动时，
最简单的恢复方式是卸载和重新安装 DC/OS Kubernetes。
在重新安装 DC/OS Kubernetes 之前，您应确保每个 DC/OS
代理是健康的，并且 DC/OS 集群本身是健康的（例如，
无网络问题），并且符合所有 [先决条件](../install)。

### 场景 2

第二个场景涉及当将
`kubernetes.high_availability` 的值从 `false` 切换为 `true` （比如，扩展
现有的 `etcd` 集群时）时可能出现的故障。在此场景中，存在
永久丢失 `etcd` 集群和相关数据的风险（较低）。要
防止这种情况（但要为这种情况做好准备），您可以采取
一些预防措施。

#### 执行现有安装的备份

在转移 `kubernetes.high_availability` 的值前，我们 
**强烈建议** 您使用
[灾难恢复](../disaster-recovery) 中的指令对当前的安装进行备份。当执行扩展操作时，
`etcd` 集群中不太可能出现故障，
您应卸载 DC/OS Kubernetes，并按顺序使用 `dcos kubernetes restore`，
以将备份恢复到新集群中。然后，您可以重试将 `kubernetes.high_availability` 的值从 `false` 更新为 `true`。如果此操作连续
两次或三次失败，那么您的 DC/OS 集群可能是不健康的；我们鼓励您联系技术支持部门，以进一步解决问题。

#### 执行 `etcd` keyspace 的快照

除了使用 `dcos kubernetes backup` 创建备份（如上所述），
也可以创建 `etcd` keyspace 的快照，使用 
`etcdctl`。如有必要，可以将此快照恢复到在 DC/OS 外部运行的 `etcd` 集群
中。要创建 `etcd` keyspace 的快照，您可以运行
以下命令（根据需要替换 `<SERVICE_NAME>` 占位符）：

```
# dcos task exec <SERVICE_NAME>__etcd-0-peer \
    find . -name etcdctl -exec {} \
        --endpoints https://etcd-0-peer.<SERVICE_NAME>.mesos:2379 \
        --cacert ca-crt.pem \
        --cert etcd-crt.pem \
        --key etcd-key.pem \
        snapshot save etcd-0-peer.db \
    \;
```

这将创建名为 `etcd-0-peer.db` 的文件，该文件位于
`etcd-0-peer` 任务的工作目录，其中包含 `etcd` keyspace 的快照。然后您
从 `etcd-0-peer` 任务中获取 `etcd-0-peer.db` 文件并将其存储到
安全的地点（例如，您的工作站或云存储）。要从
`etcd-0-peer` 任务中获取 `etcd-0-peer.db` 文件，您可以使用
DC/OS UI 或手动 `scp` 从 DC/OS 代理获取。

#### 如果设置生产，则以 `kubernetes.high_availability=true` 开始

如果您从一开始就打算设置生产 DC/OS
Kubernetes 集群，我们建议您
首次安装包时设置 `kubernetes.high_availability=true`。该
降低了数据丢失的几率，此时产生的所有故障都属于
之前所描述的 [场景 1](#scenario-1)。

### 场景 3

第三个场景涉及单个 `etcd` 成员（使用中）出现的故障，
这是在 `kubernetes.high_availability` 被设置为 `false` 时。此场景中可能
会发生两种主要类型的故障：

1. `etcd-0-peer` 任务崩溃，但 DC/OS 代理保持健康。
1. DC/OS 代理永久故障。

当 `etcd-0-peer` 任务崩溃时，正在运行的 DC/OS 代理
保持健康，任务只需在同一代理中重新启动，
现有数据会被保留。DC/OS Kubernetes 集群整体可能会
出现不稳定性，其他任务（例如，
`kube-apiserver-0-instance` 或 `kube-scheduler-0-instance`）也可能会重新启动，
但您现有的 `etcd` 数据会保持安全。通常，无需手动
干预该场景。

当 `etcd-0-peer` 正在运行的 DC/OS 代理出现永久故障时，
就如 [限制](../limitations) 中所述的，`etcd` 数据目录
的内容将 **永久丢失**。要恢复您的数据，您必须使用 `dcos kubernetes restore`，如
[灾难恢复](../disaster-recovery) 中所述。因此，*强烈建议* 您使用
`dcos kubernetes backup` 来定期备份您的 DC/OS Kubernetes 集群，以避免在
 `kubernetes.high_availability` 被设置为 `false`的集群中运行生产工作负载。

### 场景 4

第四个场景涉及 `etcd` 成员
在使用 `kubernetes.high_availability=true` 时出现的故障。此场景中可能发生两种
主要故障：

1. 单个 `etcd` 任务（例如，`etcd-0-peer`）永久崩溃。
1. 两个或多个 `etcd` 任务永久崩溃。

永久丢失单个 `etcd` 成员不代表出现问题，因为
`etcd` 集群中的 quorum 未丢失。存储于 `etcd` 中的数据也
未丢失，因为仍有两个活动成员存放着数据。在此
场景中，通过运行以下命令，可以清除并在不同的 DC/OS 代理中重启一个故障 `etcd` 成员，
（替换 `<SERVICE_NAME>` 和
`<etcd-task-name>`）：

```
# dcos kubernetes --name=<SERVICE_NAME> pod replace <pod-name>
{
  "pod": "etcd-1",
  "tasks": [
    "etcd-1-peer",
    "etcd-1-recover"
  ]
}
```

然而，永久丢失两个或多个成员将导致 `etcd` 集群
丢失 quorum，变得不可操作。在此场景中，您必须使用
`dcos kubernetes restore` 从之前的备份中重新创建 DC/OS Kubernetes 集群，
如 [灾难恢复](../disaster-recovery) 中所述。


## 阅读更多

要更好地了解 `etcd` 故障排除和灾难
恢复以及为什么某些所述情境代表永久性
quorum 丢失和 `etcd` 集群故障，我们建议您阅读官方 `etcd`
[灾难恢复](https://coreos.com/etcd/docs/latest/op-guide/recovery.html)
和 [FAQ](https://coreos.com/etcd/docs/latest/faq.html) 文档。
