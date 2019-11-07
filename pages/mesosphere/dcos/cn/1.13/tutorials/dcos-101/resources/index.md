---
layout: layout.pug
navigationTitle: 分配和扩展资源
title: 分配和扩展资源
excerpt: 提供用于扩展分配给部署的应用程序的资源的策略和示例（第 9 部分）
menuWeight: 9
render: mustache
model：/mesosphere/dcos/1.13/data.yml
---
此时，您已经了解到如何创建群集以及如何部署和测试群集上运行的应用程序和服务。您已经使用在 Docker 和 DC/OS UCR 容器中运行的单个命令和应用程序。通过本教程，您将通过容器编排了解到一些核心利益提供商，并执行一些常见的资源扩展任务。

# 编排和群集管理
容器编排在群集管理中起着重要作用。容器编排通过提供满足重要要求的功能（例如弹性操作、资源分配和服务管理），帮助您管理在群集上部署的应用程序的生命周期。

## 群集弹性
容器编排有助于确保通过以下方式进行弹性操作：
- 根据群集的当前状态、大小和配置确定容器初始放置的适当位置。
- 支持分布式处理和扩展，以优化性能、容错和高可用性。
- 提供独立的健康监控和自我修复操作，以恢复发生故障的容器或代理，使活动可以继续进行而不中断。
- 简化软件升级或降级的部署。

## 资源分配和使用
容器编排提高了您管理资源分配的能力，并通过确保容器获得运行所需的特定资源来监控资源消耗，包括：
- 内存
- CPU
- 磁盘
- GPU
- 卷
- 端口
- IP 地址
- 镜像和伪影

## 服务识别和管理
容器编排结合其他功能帮助您组织、分发和监控您部署的服务。例如，您可以：
- 向服务添加标签以创建用于查询和组织服务的元数据。
- 使用组或命名空间来定义服务的层次结构及其之间的关系（包括依赖关系）。
- 监控运行状况和就绪情况，确保应用程序可用并正常运行。

本教程重点介绍任务之间的 **资源管理** 和 **资源隔离**。这两个活动是任何操作系统的核心功能，是有效集群管理的核心元素。在本教程中，您将学习如何监控资源使用情况，如何实施资源限制以及如何调试资源管理问题。有关容器编排其他方面的信息，请参阅本教程结尾部分列出的[相关主题](#相关主题)。

# 开始之前
在开始本教程前，您应验证以下内容：
- 您可以通过至少一个管理节点和三个代理节点来访问运行中的 [DC/OS 群集](../start-here/)。
- 您可以访问安装了 [DC/OS CLI](../cli/) 的计算机。
- 您拥有在群集中部署和运行的示例 [dcos-101/app2](../native-app/) 应用程序。

# 学习目的
完成本教程，您将学习到：
- 如何为应用程序添加资源布局约束。
- 如何监控和了解您的资源利用率。
- 如何实施资源限制。
- 如何调试资源管理问题。

# 查看应用定义
如果您再次查看 [app2](https://github.com/joerg84/dcos-101/blob/master/app2/app2.go) 示例应用程序的 [应用定义]((https://raw.githubusercontent.com/joerg84/dcos-101/master/app2/app2.json)) ，则可以在 `cpus`、`mem`、`disk` 和 `gpus` 设置中看到为该应用程序分配的资源。例如：

```json
{
  "id": "/dcos-101/app2",
  "cmd": "chmod u+x app2 && ./app2",
  "args": null,
  "user": null,
  "env": null,
  "instances": 1,
  "cpus": 1,
  "mem": 128,
  "disk": 0,
  "gpus": 0,
  "executor": null,
  "constraints": null,
```

### 扩展前的资源分配
`cpus`、`mem`、`disk` 和 `gpus` 的值为任务可以使用的每个资源定义 **maximum**。任务很少使用分配的最大资源，但这些设置指定了允许任务使用的上限值。

### 将组用于公共资源要求
您可能已经注意到 [app1](https://raw.githubusercontent.com/joerg84/dcos-101/master/app1/app1.json) 和 [app2](https://github.com/joerg84/dcos-101/blob/master/app2/app2.go) 应用定义中的标识符以 `/dcos-101/` 为前缀。

此常用标识符用于定义两个示例应用程序所属的特定 **应用程序组**。应用程序组允许您指定和配置详细信息和依赖关系，并将其同时应用于多个应用程序。

# 扩展应用程序
当您的应用需要更多资源时，可以**水平** 或 **垂直**扩展资源 。

水平扩展包括增加或减少应用程序实例的数量。您可以通过两种方式扩展实例计数：

- 通过设置因素以一个因素应用于整个应用程序组。
- 通过为单个应用程序设置特定数量的实例。

## 扩展应用程序组
由于 `appl` 和 `app2` 示例应用程序共享同一个应用程序组，您可以将它们一起扩展。

为了解如何扩展和缩小整个应用程序组，执行以下操作：

1. 通过运行以下命令，使用两倍比例因数来扩展应用程序组：

    ```bash
    dcos marathon group scale dcos-101 2
    ```

1. 通过运行以下命令，验证两个示例应用程序是否均已扩展：

    ```bash
    dcos marathon app list
    ```

1. 通过运行以下命令再次缩小应用程序组：

    ```bash
    dcos marathon group scale dcos-101 0.5
    ```

1. 通过运行以下命令，验证两个应用程序是否均已缩小：

    ```bash
    dcos marathon app list
    ```

## 直接设置实例计数
在某些情况下，您可能希望独立扩展单个应用程序。为了解如何扩展和缩小整个应用程序组，执行以下操作：

1. 通过运行以下命令将 `app2` 扩展到 3 个实例：

    ```bash
    dcos marathon app update /dcos-101/app2 instances=3
    ```

    实例更新将逐步应用于现有应用定义。

1. 通过运行以下命令，验证 `app2` 是否已扩展：

    ```bash
    dcos marathon app list
    ```

1. 通过运行以下命令将 `app2` 缩减到一个实例：

    ```bash
    dcos marathon app update /dcos-101/app2 instances=1
    ```

1. 通过运行以下命令，验证 `app2` 是否已扩展：

    ```bash
    dcos marathon app list
    ```

## 扩展分配资源
垂直扩展包括增加或减少分配给应用程序实例的资源，例如，CPU 或内存。您应记住，垂直扩展需要重新启动应用程序，这可能会影响服务可用性。在生产环境中，如可能，您应该计划资源扩展并将任何更改纳入计划的维护周期内。

1. 通过运行以下命令将 `app2` 实例增加到两个 CPU：

    ```bash
    dcos marathon app update /dcos-101/app2 cpus=2
    ```

1. 通过运行以下命令，验证 `app2` 是否已扩展：

    ```bash
    dcos marathon app list
    ```

1. 通过运行以下命令将 `app2` 实例减少到一个 CPU：

    ```bash
    dcos marathon app update /dcos-101/app2 cpus=1
    ```

# 调试资源问题
在管理 DC/OS 群集上运行的应用程序的资源时，您应该了解如何识别和解决一些常见问题。下面的主题涵盖其中的几个案例。

## 群集中的资源不足
通过运行类似以下命令，尝试增加 `app2` 实例的数量以模拟此问题：
`dcos marathon app update /dcos-101/app2 instances=100`

此示例将实例数增加到 100。如果您有大型群集，您可能需要设置更高的实例数量。

### 症状
在增加实例数量之后，运行 `dcos marathon app list` 或 `dcos marathon deployment list` 以检查 `scale` 部署是否卡住。

```
/dcos-101/app2   128    1    1/100   N/A      scale     True        N/A     chmod u+x app2 && ./app2
```
  
### 原因
此处的问题在于没有可用的匹配资源。例如，可能为公共代理角色保留了资源，但没有为默认角色保留资源。

### 解决方案
解决此问题，您可以向群集中添加节点到或将应用程序缩减到资源可用的级别。例如，运行类似以下内容的命令：
`dcos marathon app update /dcos-101/app2 --force instances=1`

您必须使用此命令中的 `--force` 选项，因为前一部署正在进行。

## 单个节点上的资源不足
因为每个应用程序都在单个节点上启动，所以任务资源也必须适合单个节点。通过运行类似以下命令，尝试使用 10 个 CPU 更新 `app2` 应用程序以模拟此问题：
`dcos marathon app update /dcos-101/app2 cpus=10`

### 症状
在增加 CPU 数量之后，运行 `dcos marathon app list` 或 `dcos marathon deployment list` 以检查 `restart` 部署是否卡住。例如，如果您运行 `dcos marathon deployment list`，您可能会看到：

```
APP             POD  ACTION   PROGRESS  ID                                    
/dcos-101/app1  -    restart    0/1     f257caa6-672b-4a92-8621-27fba79b9c00  
/dcos-101/app2  -    restart    0/1     692cce55-fd2a-482e-8d46-84fbc12a2927  
```

### 原因
此处的问题是没有足够大的资源提供可以与请求匹配。

### 解决方案
您可以提供更大的节点或将应用程序缩减到适合单个节点上空闲资源的级别以解决此问题。例如，运行类似以下内容的命令：
`dcos marathon app update /dcos-101/app2 --force cpus=1`

您必须使用此命令中的 `--force` 选项，因为前一部署正在进行。

# 资源分配或资源隔离不足
在某些情况下，您可能有一个应用程序尝试使用比分配给它的资源更多的资源。这是与基于 JVM 的应用程序结合使用的内存消耗的常见问题。通过运行以下命令，尝试部署示例 [out-of-memory app](https://github.com/joerg84/dcos-101/blob/master/oomApp/oomApp.go) 以模拟此问题：
`dcos marathon app add https://raw.githubusercontent.com/joerg84/dcos-101/master/oomApp/oomApp.json`

### 症状
部署示例应用程序后，检查 Marathon 日志，看看其是否包含内存不足错误。因为内核正在终止应用程序，这些错误并不总是对 DC/OS 可见。在此案例中查看问题，您需要确定内存不足的应用程序任务的 Mesos ID 并在运行该任务的计算机上查看内核日志文件。

1. 通过运行类似以下命令，在运行内存不足应用程序的代理上打开终端和安全外壳 (SSH) 会话：

    ```bash
    dcos node ssh --master-proxy --mesos-id=99f56b43-c1a7-4858-be19-5fec03fc88de-S1
    ```

1. 通过运行以下命令检查内核日志：

    ```bash
    journalctl -f _TRANSPORT=kernel
    ```

    日志文件应包含类似于以下内容的消息：

    ```
    Memory cgroup out of memory: Kill process 10106 (oomApp) score 925 or sacrifice child; Killed process 10390 (oomApp) total-vm:3744760kB, anon-rss:60816kB, file-rss:1240kB, shmem-rss:0kB`
    ```

### 原因
大多数情况下，您的应用程序使用过多内存有两个潜在原因：

- 应用程序代码中存在导致应用程序使用过多内存的问题，例如，因为代码逻辑中存在内存泄漏。

- 您为该应用程序分配的内存过少。

### 解决方案
要解决这些潜在问题，检查应用代码以纠正任何此类编程错误。如果问题不在代码本身中，则增加您已为应用程序分配的内存量。

要完成本教程，请务必通过运行以下命令来删除内存不足的应用程序：

```bash
dcos marathon app remove /dcoc-101/oom-app
```

# 后续步骤
在本教程中，您学习了如何查看分配给应用程序任务的资源，以及如何扩展和调试潜在的资源问题。

# 相关主题
现在您已经几乎是专家了，您可能希望开始探索更高级的主题和配置选项，例如：
- 使用应用程序组和 [标签](../../task-labels/)
- 定义 [布局约束](/mesosphere/dcos/1.13/deploying-services/marathon-constraints/)
- 在 [pods](/mesosphere/dcos/1.13/deploying-services/pods/) 中部署应用程序
