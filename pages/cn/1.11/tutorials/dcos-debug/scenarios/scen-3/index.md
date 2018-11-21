---
layout: layout.pug
title: 方案 3
navigationTitle: 方案 3
excerpt: 教程 - Docker 镜像
menuWeight: 21
---

## 方案 3：Docker 镜像

## 设置

首先部署此 [`dockerimage.json`](https://raw.githubusercontent.com/dcos-labs/dcos-debugging/master/1.10/dockerimage.json) 文件：

```bash
$ dcos marathon app add https://raw.githubusercontent.com/dcos-labs/dcos-debugging/master/1.10/dockerimage.json
```

我们看到应用程序几乎立即出现故障：

![故障图片](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-17.png)

图 1. 显示故障的任务日志

## 解决方法

正如我们[前期](/cn/1.11/tutorials/dcos-debug/gen-strat/)所学的，对于应用程序故障， [第一步](/cn/1.11/tutorials/dcos-debug/gen-strat/#task-strat)是检查[任务日志](/cn/1.11/tutorials/dcos-debug/tools/#task-logs)。

![空日志输出图片](https://mesosphere.com/wp-content/uploads/2018/04/pasted-image-0-18.png)

图 2. 空任务日志

很遗憾，它完全是空的。**通常，我们至少会看到任务设置中的一些输出**。这是特别奇怪的行为。

因此第 2 步是检查调度程序日志，--- 在本例中是 Marathon：

```bash
$ dcos service log marathon
```

应该在响应中产生类似于以下输出的一些内容：

```bash
Mar 27 21:21:11 ip-10-0-5-226.us-west-2.compute.internal marathon.sh[5954]: [2018-03-27 21:21:11,297] INFO  Received status update for task docker-image.c4cdf565-3204-11e8-8a20-82358f3033d1: TASK_FAILED (

Mar 27 21:21:11 ip-10-0-5-226.us-west-2.compute.internal marathon.sh[5954]: ') (mesosphere.marathon.MarathonScheduler:Thread-1723)
```

但是，这并没有说明任务失败的原因。那么接下来进入我们[策略](/cn/1.11/tutorials/dcos-debug/gen-strat/)的 [第 3 步](/cn/1.11/tutorials/dcos-debug/gen-strat/#agent-strat)：使用以下命令检查 [Mesos 代理节点日志](/cn/1.11/tutorials/dcos-debug/tools/#agent-logs)：

```bash
$ dcos node log --mesos-id=$(dcos task docker-image  --json | jq -r '.[] | .slave_id') --lines=100
```

输出类似以下内容的内容：

```bash
8-4520-af33-53cade35e8f9-0001 failed to start: Failed to run 'docker -H unix:///var/run/docker.sock pull noimage:idonotexist': exited with status 1; stderr='Error: image library/noimage:idonotexist not found

2018-03-27 21:27:15: '

2018-03-27 21:27:15: I0327 21:27:15.325984  4765 slave.cpp:6227] Executor 'docker-image.9dc468b5-3205-11e8-8a20-82358f3033d1' of framework 6512d7cc-b7f8-4520-af33-53cade35e8f9-0001 has terminated with unknown status
```

看起来像**无法找到特定的 Docker 镜像**，可能因为它不存在。图像是否存在于指定位置（在本例中为 Dockerhub 中的 `noimage:idonotexist`）？ 如果不是，则必须更正位置或将文件移至指定位置。此外，指定的位置或文件名是否存在错误？ 最后，检查容器镜像注册表是否可访问（尤其是在使用专用注册表时）。
s
### 一般规律

作为应用程序错误，我们再次查看任务日志，然后查看调度程序日志。

在这本例中，我们有一个 Docker 守护程序特定的问题。通过检查 Mesos 代理节点日志，可以发现许多此类问题。在某些情况下，我们需要深入挖掘，需要访问 Docker 守护程序日志。首先，通过ssh 进入管理节点：

```bash
$ dcos node ssh --master-proxy --mesos-id=$(dcos task --all | grep docker-image | head -n1 | awk '{print $6}')
```

然后获取日志：

```bash
$ journalct1 -u docker
```

请注意，与前面的示例相比，此处使用的更复杂的规律，用于检索 `mesos-id`。此规律列出先前失败的任务以及正在运行的任务，而**较早的规律仅列出正在运行的任务**。

## 清除

运行：

```bash
$ dcos marathon app remove docker-image
```
