---
layout: layout.pug
excerpt: 第 7 部分 - 了解资源
title: 教程 - 了解资源
navigationTitle: 了解资源
menuWeight: 7
---


<table class=“table” bgcolor=#858585>
<tr> 
  <td align=justify style=color:white><strong>重要信息：</strong>Mesosphere 不支持本教程、相关脚本或命令，它们不提供任何形式的保证。本教程的目的仅仅是为了演示功能，它可能不适合在生产环境中使用。在您的环境中使用类似的解决方案之前，您应该进行调整、验证和测试。</td> 
</tr> 
</table>

欢迎阅读 DC/OS 101 教程第 7 部分。


# 先决条件
* [正在运行的 DC/OS 集群](/cn/1.11/tutorials/dcos-101/cli/)，[已安装 DC/OS CLI](/cn/1.11/tutorials/dcos-101/cli/)。
* [app2](/cn/1.11/tutorials/dcos-101/app2/) 已部署并在您的集群中运行。

# 目的

任务之间的资源管理和资源隔离是任何操作系统的核心功能。在本部分中，您将学习如何监控和了解资源利用率，如何实施资源限制以及如何调试资源管理问题。

# 步骤

## 查看应用定义

* 再次查看 [app2](https://github.com/joerg84/dcos-101/blob/master/app2/app2.go) 的应用定义。

```
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
  ...
```

* 以上 `cpus`、`mem`、`disk` 和 `gpus` 参数指定分配的资源，从而定义任务可使用的最大资源量。此数字不一定与任务实际使用的资源量相同。该数字通常较低。

* 您会注意到 [app1](https://raw.githubusercontent.com/joerg84/dcos-101/master/app1/app1.json) 和 [app2](https://github.com/joerg84/dcos-101/blob/master/app2/app2.go) 应用定义中分配的 ID 以 `/dcos-101/` 为前缀。这定义了应用程序所属的[应用程序组](https://mesosphere.github.io/marathon/docs/application-groups.html)。应用程序组允许将配置和依赖项同时应用于一组应用程序。

## 扩展应用程序

当您需要为应用程序提供更多资源时，您可以在水平和垂直两个维度上进行扩展。

### 通过增加实例计数进行水平扩展

水平扩展包括增加应用程序实例的数量。您可以通过两种方式扩展实例计数：

1. 按倍数扩展整个应用程序组。
1. 直接设置应用程序的实例数。

**扩展 dcos-101 应用程序组：**

由于 appl 和 app2 共享同一个应用程序组，我们可以将它们一起扩展。

* 增加 2 倍：

`dcos marathon group scale dcos-101 2`
* 检查 app1 和 app2 是否已增加：

`dcos marathon app list`
* 再次减少：

`dcos marathon group scale dcos-101 0.5`
* 检查 app1 和 app2 是否已减少：

`dcos marathon app list`

**直接为 app2 设置实例计数：**

如果您想独立扩展单个应用程序，这非常有用

* 将 app2 扩展到 3 个实例：

`dcos marathon app update /dcos-101/app2 instances=3`

请注意，这些将逐步应用于现有应用定义。
* 检查 app2 是否已扩展：

`dcos marathon app list`
* 将 app2 重新调整为 1 个实例：

`dcos marathon app update /dcos-101/app2 instances=1`
* 检查 app2 是否已扩展：

`dcos marathon app list`


### 通过增加分配资源进行垂直扩展

垂直扩展包括增加分配给实例的 CPU 或 RAM 等资源的量。

**注意**：这会导致应用程序重启！

* 为 app2 实例增加 2 个 CPU：

`dcos marathon app update /dcos-101/app2 cpus=2`
* 检查 app2 是否已扩展：

`dcos marathon app list`
* 将 app2 实例减少到 1 个 CPU：

`dcos marathon app update /dcos-101/app2 cpus=1`

# 调试资源问题

## 集群中的资源太少

要模拟这个情况：

* 将 app2 实例增加到 100

`dcos marathon app update /dcos-101/app2 instances=100`

如果您有大型集群，则可能必须增加此数字。
* 使用 `dcos marathon app list` 检查 `scale` 部署是否受阻。
* `dcos marathon deployment list`

此处的问题在于没有可用的匹配资源。例如，可能存在用于公共-从属角色的资源，但不包括默认角色。

解决方案：

* 添加节点或将应用程序扩展到可用资源的级别。

`dcos marathon app update /dcos-101/app2 --force instances=1`

请注意，您必须在此处 `--force` 标记，因为前一部署正在进行。

## 单个节点上的资源太少

由于每个应用程序都在单个节点上启动，因此任务资源也必须适合单个节点。

要模拟这个情况：

* 更新 app2 以使用 100 个 CPU：

`dcos marathon app update /dcos-101/app2 cpus=100`
* 使用 `dcos marathon app list` 检查 `restart` 部署是否受阻。
* `dcos marathon deployment list`

此处的问题是没有足够大的资源邀约可以与请求匹配。

解决方案：

* 提供更大的节点或将应用程序减容到适合单个节点上空闲资源的级别：

`dcos marathon app update /dcos-101/app2 --force cpus=1`

请注意，您必须再次使 force 标记。

# 调试资源隔离

如果应用程序尝试使用比分配给它的资源更多的资源，会发生什么情况？ 最常见的问题是与基于 JVM 的应用程序结合使用的内存消耗。

要模拟这个情况：

* 部署 [memory eater](https://github.com/joerg84/dcos-101/blob/master/oomApp/oomApp.go) 应用程序。

`dcos marathon app add https://raw.githubusercontent.com/joerg84/dcos-101/master/oomApp/oomApp.json`

* 您会看到它一遍又一遍地重新启动……

检查 Marathon 日志。可能您会在此处看到 Out of Memory 错误，但遗憾的是并非总是如此 - 因为内核正在终止应用程序，这可能不总是对 DC/OS 可见。

* 通过 SSH 连接到应用程序已在其中运行的代理程序：

`dcos node ssh --master-proxy --mesos-id=$(dcos task oom-app --json | jq -r '.[] | .slave_id')`
* 检查内核日志：

`journalctl -f _TRANSPORT=kernel`

此时，您可以看到以下内容：

```
    Memory cgroup out of memory: Kill process 10106 (oomApp) score 925 or sacrifice child; Killed process 10390 (oomApp) total-vm:3744760kB, anon-rss:60816kB, file-rss:1240kB, shmem-rss:0kB`
```

解决方案：

应用程序使用过多内存有两个潜在原因：

1. 您的应用程序意外使用过多内存，例如代码中的内存泄漏。
1. 您为它分配的内存过少。

因此，请检查应用程序表现是否正确和/或增加分配的内存。

* 删除应用程序：

`dcos marathon app remove /dcoc-101/oom-app`

# 结果

祝贺您！您已经学习了如何将应用部署到 DC/OS、将这些应用程序联网、使用负载均衡器将它们公开到集群外部、扩展它们以及调试潜在的资源问题！您基本已是专家了！
