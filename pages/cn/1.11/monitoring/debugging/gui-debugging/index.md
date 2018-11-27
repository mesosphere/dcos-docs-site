---
layout: layout.pug
title: 从 DC/OS Web 界面进行调试
menuWeight: 0
excerpt: 从 DC/OS Web 界面进行调试
beta: true
enterprise: false
---

<!-- The source repo for this topic is https://github.com/dcos/dcos-docs-site -->


您可以从 DC/OS Web 界面来调试服务和 Pod。

## 服务和 Pod 健康和状态摘要

如果您已为服务或 Pod 添加了 Marathon 健康检查，DC/OS 仪表盘上的**服务健康**方框将报告此服务或 Pod 的健康状况。

**服务** > **服务**页面列出了每个服务或 Pod、所请求的资源及其状态。可能的状态为 `Deploying`、`Waiting` 或 `Running`。如果您已设置 Marathon 健康检查，则还可以看到服务或 Pod 的健康状况：绿点表示健康，红点表示不健康。如果您没有设置健康检查，圆点将为灰色。

![Mesosphere DC/OS Enterprise 服务](/cn/1.11/img/services-ee.png)

图 1. DC/OS 服务 > 服务页面

## 调试页面

若要显示详细的调试页面，请点击服务或 Pod 的名称，然后点击 `Debug` 选项卡。在这里，您可以看到**最后一次更改**、**最后一次任务失败**、**任务统计信息**、**近期资源邀约**。您还会看到资源邀约**摘要**、符合服务或 Pod 要求的邀约百分比，以及列出了服务或 Pod 运行所在的主机和针对每次部署而言哪些资源邀约成功和不成功的**详情**部分。您可以使用此页面上的信息了解在哪里以及如何修改服务或 Pod 定义。

![调试屏幕](/cn/1.11/img/debug-ui.png)

图 2. 调试页面
