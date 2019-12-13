---
layout: layout.pug
navigationTitle: 节点
title: 节点
menuWeight: 5
excerpt: 使用“节点”菜单
---

“节点”菜单全面展示整个集群中使用的所有节点。您可以查看显示 CPU、内存或磁盘分配百分比的图表。

![Nodes](/mesosphere/dcos/cn/1.11/img/nodes-ee.png)

图 1. 节点列表视图

默认情况下，所有节点均显示在 **List** 视图，并按主机名排序。可以按服务类型或主机名筛选节点。也可以按任务数或分配的 CPU、内存、或磁盘空间百分比对节点进行排序。

可以切换为 **Grid** 视图，查看“环状图”百分比可视化界面。

![Nodes](/mesosphere/dcos/cn/1.11/img/nodes-donuts-ee.png)

图 2. 节点网格视图

单击节点会打开“节点”侧面板，提供 CPU、内存和磁盘使用情况图表，并列出节点上的所有任务。使用下拉列表或自定义筛选器对任务进行排序，并单击详情以获取更多信息。单击“节点”侧面板上列出的任务，查看任务的 CPU、内存和磁盘使用情况以及任务文件和目录树的详细信息。

![Nodes Details](/mesosphere/dcos/cn/1.11/img/nodes-details.png)

图 3. 节点 > 详情
