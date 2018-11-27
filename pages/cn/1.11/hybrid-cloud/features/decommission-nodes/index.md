---
layout: layout.pug
navigationTitle: 停用节点
title: 停用节点
menuWeight: 15
excerpt: 停用节点
enterprise: true
---

为通过添加节点来支持云爆发，还需支持停用节点。删除节点包括两个步骤：命令 DC/OS 将节点标记为 `GONE`，并停止相应的 Mesos 从设备 `systemd` 器件。

如果您的节点以意外方式停工，您只需要 [停用节点](/cn/1.11/administering-clusters/delete-node/#decommission-the-node/)。

# 关闭节点

1. （您希望关闭的）[SSH 至代理节点](/cn/1.11/administering-clusters/sshcluster/)。

1. 输入以下命令，停止节点。

 - **私有代理**

  ```bash
  sudo sh -c 'systemctl kill -s SIGUSR1 dcos-mesos-slave && systemctl stop dcos-mesos-slave'
  ```
 - **公共代理**

  ```bash
  ⁠⁠⁠⁠sudo sh -c 'systemctl kill -s SIGUSR1 dcos-mesos-slave-public && systemctl stop dcos-mesos-slave-public'
  ```

# 停用节点

当 Mesos 检测到某个节点已停止时，它将节点置于 `UNREACHABLE` 状态，因为 Mesos 不知道节点是暂时停止并将重新上线，还是永久停止。如果您知道节点不会恢复，您可以明确告诉 Mesos 将节点置于 `GONE` 状态。

节点停用后，对应的代理 ID 被内部标记为 `GONE` 并且不允许返回和在管理节点上重新注册。节点上运行的任务已过渡到 `TASK_GONE_BY_OPERATOR` 状态。

您应该在以下情况下停用节点。

- 您在删除节点，尤其是删除多个节点时。DC/OS 配置为每 20 分钟仅允许标记一个节点为 `UNREACHABLE` ，所以，如果您不是明确地停用节点，可能需要较长时间 Mesos 才能将您的节点标记为 `UNREACHABLE` 并允许服务在另一节点上被重新安排。

- 如果您正使用有状态服务，如 [DC/OS 数据服务](/services/)。有状态服务重新安排任务代价昂贵，所以服务需要在重新安排前知道代理不会再次返回在线。

- 当节点意外停工时。

从 DC/OS CLI 中输入以下命令，以标识要停用的节点。

```
dcos node
```

从 DC/OS CLI 中输入以下命令，以告诉 Mesos 将节点标记为 `GONE`。

```
dcos node decommission <mesos-agent-id>
```

节点被停用后（这与使用 `MARK_AGENT_GONE` Mesos API 等同)，节点将被要求执行以下任务：
-关闭（kill）代理节点上运行的所有执行程序（任务）
-停止 Mesos 从进程（但它将被 systemd 自动重新启动）

**注意：** *仅*在节点永远不会返回（例如，EC2 VM 销毁）时才应该停用节点 。节点停用后，对应的代理 ID 被内部标记为 `GONE` 并且不允许返回和在管理节点上重新注册。节点上运行的任务已过渡到 `TASK_GONE_BY_OPERATOR` 状态。


# 关闭节点

如果 DC/OS 节点仍在运行，Mesos从进程将继续尝试注册（并且由于代理被标记为已消失，注册会被拒绝）。您可以通过停止 Mesos 从进程（以 systemd 单元运行），停止这些尝试。

1. （您希望关闭的）[SSH 至代理节点](/cn/1.11/administering-clusters/sshcluster/)。

1. 使用以下命令停止节点。

 - **私有代理**

  ```bash
  sudo sh -c 'systemctl stop dcos-mesos-slave'
  ```
 - **公共代理**

  ```bash
  ⁠⁠⁠⁠sudo sh -c 'systemctl stop dcos-mesos-slave-public'
  ```
