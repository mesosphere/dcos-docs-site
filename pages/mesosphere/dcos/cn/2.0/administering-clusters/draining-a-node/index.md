---
layout: layout.pug
navigationTitle:  排空节点
title: 排空节点
menuWeight: 801
excerpt: 排空活跃 DC/OS 群集中的代理节点
enterprise: false
渲染：胡须
型号：/mesosphere/dcos/2.0/data.yml
---

您可以从活跃 DC/OS 群集中的代理节点排空任务，以便取下节点以进行维护或从群集中永久移除。节点可以排空，并且其进度可以通过 DC/OS CLI 或 UI 进行监控。

<p class="message--warning"><strong>警告：</strong>启动排空时，代理节点上运行的所有任务都将被关闭。请谨慎使用此功能！</p>
<p class="message--warning"><strong>警告：</strong>当指定 <code>-停用</code> 选项时，节点上的所有本地持久数据将丢失！</p>

启动排空会导致目标代理节点上的所有任务立即收到关闭事件（假设代理节点目前可以访问）。如果代理节点无法访问，关闭事件的启动将被延迟，直到代理节点可再次被管理节点访问。当任务收到关闭事件时，将向任务发送一个 SIGTERM 信号以开始关闭进程。根据具体任务的行为，此信号可能足以将其终止。某些任务可能使用此信号来开始优雅终止的过程，这可能需要一些时间。延迟后，SIGKILL 信号将发送至任务，它会在任务仍运行时强行将其终止。SIGTERM 和 SIGKILL 信号之间的延迟取决于该任务的结束宽限期长短。如果没有为任务设置宽限期，将根据配置使用默认的数秒值。

### 先决条件：

*   [已安装并配置 DC/OS CLI](/mesosphere/dcos/2.0/cli/)。
*   有足够 [权限](/mesosphere/dcos/2.0/security/ent/perms-reference) 排空节点（仅限 Enterprise DC/OS）。

### 最大宽限期

排空时可以设置最大宽限期，它可对关闭宽限期的持续时间设置上限。进行此项设置时，在关闭任务时将使用最小的任务宽限期和最大宽限期。

### 排空后停用代理节点

某些情况下，例如随后缩小的自动缩放云实例，您可能知道在节点排空并取下之后，它永远不会再回来。每个代理节点都由其硬盘上的元数据唯一性标识，即使未来会扩展其他实例，如果它们不保留上一个实例的持续元数据，则会被 DC/OS 群集视为新节点。

如果唯一代理节点在从群集中排空并移除之后不会返回，您可以指定一个选项，该选项将在完成排空后自动停用节点，这将从群集中删除代理节点的元数据。如果未指定此选项，群集将记住代理节点，以防它以后重新注册到群集中。

## 使用 CLI 排空

要通过 DC/OS CLI 排空一个节点，首先应在下列命令输出的 `ID` 列找到该节点的 Mesos 代理节点 ID：

```bash
dcos node list
```

然后结合 `dcos node drain` 命令使用该 ID：

```bash
dcos node drain <mesos-agent-id>
```

可以指定最大宽限期和/或停用选项，例如：

```bash
dcos node drain <mesos-agent-id> --max-grace-period=10m --decommission
```

一旦代理节点开始排空，您便可以通过运行以下内容来监控该节点上的任务：

```bash
dcos task list --agent-id=<mesos-agent-id>
```

可以使用以下命令来监控节点上排空的总体进度：

```bash
dcos node list --mesos-id=<mesos-agent-id>
```

找到 `STATUS` 字段：节点的常规状态是 `ACTIVE`。在节点上启动排空时，它将转为 `DRAINING`。一旦所有任务关闭且终端状态更新已由相关服务确认，并且节点上的所有资源操作都完成后，它将转为 `DRAINED`。当节点处于 `DRAINED` 状态时，排空完成。

如果 `--decommission` 选项包含在初始排空命令中，则在排空完成时，节点的元数据将自动从群集中移除。需要注意的是，停用节点还会导致该节点上的所有本地持久数据丢失。如果未指定停用选项，当任何计划内维护或其他更新程序完成时，群集将等待节点被手动重新激活。

在执行维护前，应停止节点上的 `dcos-mesos-slave` systemd 单元（或 `dcos-mesos-slave-public` 对于公共代理），使代理节点不再尝试向管理节点注册：

```bash
systemctl stop dcos-mesos-slave
```

## 维护后重新激活代理节点

维护完成后，您已准备好重新激活节点并允许其重新加入群集时，可以使用以下命令完成此操作：

```bash
dcos node reactivate <mesos-agent-id>
```

在节点上执行以下命令，启动 `dcos-mesos-slave` systemd 单元（或 `dcos-mesos-slave-public` 对于公共代理），代理将重新加入群集：

```bash
systemctl start dcos-mesos-slave
```

## 通过 UI 监控排空情况

还可以通过 DC/OS UI 来监控代理节点的排空情况。要这样做，请导航到 `Nodes`“概览”窗格。`Status` 列将列出 `Active`、`Draining` 或 `Drained`，与 CLI 的 `node list` 命令输出相似。

## 关于节点排空的注释

排空在代理节点上启动后将无法取消。应谨慎使用此命令，尤其是通过 `--decommission` 选项执行时，因为这会导致在排空完成后，节点永久从群集中移除。

如果某个节点卡在 `DRAINING` 状态并且在经过预计持续时间（`--max-grace-period` 自变量中规定的持续时间，或节点上运行的任务的最长关闭宽限期）之后未过渡到 `DRAINED`，则应检查节点以确定原因。节点处于 `DRAINING` 状态后，无需再次发出 `dcos node drain` 命令，因为这无效。如果节点上的所有任务都已终止，则可能相关服务尚未确认终端任务状态更新，或者该节点上的资源操作未完成。为排除前者，应检查在节点上运行任务的相关服务，并确保它们正在运行且可用。您可以列出节点上的任务，以确定哪些服务可能尚未确认其终端更新：

```bash
dcos task list --agent-id=<mesos-agent-id>
```

为排除后者，可在代理节点上使用 [`GET_OPERATIONS`](http://mesos.apache.org/documentation/latest/operator-http-api/#get_operations-1) 调用，以检查当前未完成的资源操作。如果资源操作仍处于 `Pending` 状态，则该操作可能长时间运行，需要一些时间来完成，或者由于实际执行该操作的存储后端存在某些问题而会被卡住。

## 手动排空代理节点

虽然上述自动排空程序很可能适用于大多数使用情形，但是当需要对排空过程有更大控制时，也可以手动排空节点。为此，首先取消激活该节点：

```bash
dcos node deactivate <mesos-agent-id>
```

这将停止在该代理节点上启动任何新工作负载。此时，个别服务公开的 API 可用于关闭节点上运行的任何任务。例如，对于通过 DC/OS UI 启动的典型应用程序和 pod，[Marathon 容器编排器的 API](/mesosphere/dcos/2.0/deploying-services/marathon-api/) 可用于终止相关任务。关闭节点上的所有任务后，可以取下节点进行维护，然后在维护完成后再重新激活：

```bash
dcos node reactivate <mesos-agent-id>
```
