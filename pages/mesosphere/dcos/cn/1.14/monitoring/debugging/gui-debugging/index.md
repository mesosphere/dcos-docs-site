---
layout: layout.pug
title: 从 DC/OS UI 调试
menuWeight: 0
excerpt: 使用 DC/OS UI 进行调试
渲染：胡须
型号：/mesosphere/dcos/1.14/data.yml
beta: true
enterprise: false
---


您可以从 DC/OS UI 来调试服务或 Pod。

# 服务和 Pod 健康状况与状态摘要

**服务** > **服务**页面列出了每个服务或 Pod、所请求的资源及其状态。可能的状态为 `Deploying`、`Waiting` 或 `Running`。

![Mesosphere DC/OS Enterprise 服务](/mesosphere/dcos/1.14/img/GUI-Services-Enterprise.png)

图 1 -“DC/OS 服务”页面

如果您已为服务或 Pod 添加了 Marathon 健康检查，DC/OS 仪表板上的 **状态** 方框将报告此服务或 Pod 的健康状况。如果您已设置 Marathon 健康检查，则还可以看到服务或 Pod 的健康状况：绿点表示健康，红点表示不健康，黄点则是警告信号，表示出现了问题。如果您没有设置健康检查，圆点将为灰色。


## 调试选项卡

若要显示详细的调试页面，请点击服务或 Pod 的名称，然后点击 `Debug` 选项卡。在这里，您可以看到**最后一次更改**、**最后一次任务失败**、**任务统计信息**、**近期资源邀约**。您还会看到资源邀约**摘要**、符合服务或 Pod 要求的邀约百分比，以及列出了服务或 Pod 运行所在的主机和针对每次部署而言哪些资源邀约成功和不成功的**详情**部分。您可以使用此页面上的信息了解在哪里以及如何修改服务或 Pod 定义。

![调试屏幕](/mesosphere/dcos/1.14/img/GUI-Services-Debug.png)

图 2 -“调试”页面

### 示例

在下图中，Marathon 无法启动服务；**服务 > 调试** 选项卡显示警告消息。弹出消息表示错误已清除，服务正在启动。

![失败警告](/mesosphere/dcos/1.14/img/GUI-Services-Failure-To-Launch.png)

图 3 - 显示警告的“调试”选项卡

