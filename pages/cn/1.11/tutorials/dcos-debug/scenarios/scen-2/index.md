---
layout: layout.pug
title: 方案 2
navigationTitle: 方案 2
excerpt: 教程 - 内存不足
menuWeight: 11
---

<a name=c2></a>

## 方案 2：内存不足

### 设置

部署文件 [`app-oom.json`](https://raw.githubusercontent.com/dcos-labs/dcos-debugging/master/1.10/app-oom.json)：

```bash
$ dcos marathon app add https://raw.githubusercontent.com/dcos-labs/dcos-deb
```

部署完成后，当我们查看 DC/OS Web 界面时，我们在 CPU 分配下看到一些奇怪的结果：

![CPU 分配图片](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-25.png)

图 1. CPU 分配显示

**CPU 分配如何在 0% 到 8% 之间不断变动？** 让我们看看 Web 界面中的应用程序详细信息：

![任务选项卡图片](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-24.png)

图 2. 应用程序详细信息

基于此，*应用程序运行几秒钟，然后失败**。

### 解决方法

为了更好地理解这种意外行为，让我们先看看应用程序日志，--- 在 Web 界面中或通过 CLI。通过查看应用程序“日志”选项卡中的“输出”，您可以在 Web 界面中找到应用程序日志：

![应用程序日志图片](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-15.png)

图 3. 应用程序日志显示

日志输出“Eating Memory”是一个非常慷慨的提示，问题可能与内存有关。尽管如此，没有关于内存分配的直接故障消息（请记住，**大多数应用程序不太友好，因为它们正占用内存**）。

正如所怀疑的，这可能是与应用程序相关的问题，且此应用程序是通过 Marathon 安排的。让我们使用 CLI 检查 Marathon 日志：

```bash
$ dcos service log marathon
```
我们看到的日志条目类似于：

```bash
Mar 27 00:46:37 ip-10-0-6-109.us-west-2.compute.internal marathon.sh[5866]: [2018-03-27 00:46:36,960] INFO  Acknowledge status update for task app-oom.4af344fa-3158-11e8-b60b-a2f459e14528: TASK_FAILED (Memory limit exceeded: Requested: 64MB Maximum Used: 64MB
```
**注意：**一个有用的省时提示可以是 'TASK_FAILED' 的 `grep`。

**现在，我们已经确认，我们已经超出了 [`app-oom.json`](https://github.com/dcos-labs/dcos-debugging/blob/master/1.10/app-oom.json#L6) 中先前设置的容器内存限制 **

如果您一直密切注意，您可能会大喊“等一下”，因为您注意到应用定义中设置的内存限制为 32 MB，但错误消息提到 64MB。DC/OS 自动为[执行程序](/cn/1.11/overview/architecture/task-types/#executors)保留一些多余内存，在本例中为 32 MB。

请注意，OOM `kill` 是由 Linux 内核本身执行的，因此我们也可以直接检查内核日志：

```bash
dcos node ssh --master-proxy --mesos-id=$(dcos task app-oom --json | jq -r '.[] | .slave_id')

journalctl -f _TRANSPORT=kernel

Mar 27 01:15:36 ip-10-0-1-103.us-west-2.compute.internal kernel: [ pid ]   uid  tgid total_vm      rss nr_ptes nr_pmds swapents oom_score_adj name

Mar 27 01:15:36 ip-10-0-1-103.us-west-2.compute.internal kernel: [16846]     0 16846    30939    11021      62       3        0             0 mesos-container

Mar 27 01:15:36 ip-10-0-1-103.us-west-2.compute.internal kernel: [16866]     0 16866   198538    12215      81       4        0             0 mesos-executor

Mar 27 01:15:36 ip-10-0-1-103.us-west-2.compute.internal kernel: [16879]     0 16879     2463      596      11       3        0             0 sh

Mar 27 01:15:36 ip-10-0-1-103.us-west-2.compute.internal kernel: [16883]     0 16883  1143916    14756      52       6        0             0 oomApp

Mar 27 01:15:36 ip-10-0-1-103.us-west-2.compute.internal kernel: Memory cgroup out of memory: Kill process 16883 (oomApp) score 877 or sacrifice child

Mar 27 01:15:36 ip-10-0-1-103.us-west-2.compute.internal kernel: Killed process 16883 (oomApp) total-vm:4575664kB, anon-rss:57784kB, file-rss:1240kB, shmem-rss:0kB

Mar 27 01:15:36 ip-10-0-1-103.us-west-2.compute.internal kernel: oom_reaper: reaped process 16883 (oomApp), now anon-rss:0kB, file-rss:0kB, shmem-rss:0kB
```

在这种情况下，解决方案是增加该容器的资源限制，以防其配置一开始就过低。或者，如本例中一样，修复应用程序本身的内存泄漏。

### 一般规律

在我们处理失败任务时，最好检查应用程序和调度程序日志（在本例中，我们的调度程序是 Marathon）。如果这样做不够，可以帮助查看 Mesos 代理节点日志和/或在使用 UCR（或在 Docker 容器化工具中，通过 ssh 进入节点并使用 `docker exec`）时使用 `dcos task exec`。

### 清除

使用以下命令删除应用程序

```bash
$ dcos marathon app remove /app-oom
```
