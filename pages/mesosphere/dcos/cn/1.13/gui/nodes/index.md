---
layout: layout.pug
navigationTitle:  节点
title: 节点
menuWeight: 5
excerpt: 使用“节点”页面
render: mustache
model：/mesosphere/dcos/1.13/data.yml
---

“节点”页面全面展示整个群集中使用的所有节点。您可以查看显示 CPU、内存或磁盘分配百分比的图表。

![Nodes](/mesosphere/dcos/1.13/img/nodes-ee-dcos-1-12.png)

图 1 - 代理节点选项卡

所有节点均默认显示在 **列表** 视图，并按运行状况排序。可以按服务类型、运行状况、区域和分区筛选节点。也可以按任务数或分配的 CPU、GPU、内存或磁盘空间百分比对节点进行排序。

可以切换为 **网格** 视图，查看“饼状图”百分比可视化界面。

![Nodes](/mesosphere/dcos/1.13/img/nodes-donuts-ee-dcos-1-12.png)

图 2 - 节点网格视图

单击节点会打开“节点”侧面板，提供 CPU、GPU、内存和磁盘使用情况图表，并列出节点上的所有任务。使用下拉列表或自定义筛选器对任务进行排序，并单击详情以获取更多信息。单击“节点”侧面板上列出的任务，查看任务的 CPU、GPU、内存和磁盘使用情况以及任务文件和目录树的详细信息。

单击 **管理节点** 选项卡可打开“管理节点”视图。

![Nodes](/mesosphere/dcos/1.13/img/nodes-masters-ee-dcos-1-12.png)

图 3 - 管理节点选项卡

“管理节点”选项卡显示群集中管理节点的信息。可以查看群集中的领导者和非领导者，以及他们对应的 IP 和端口、区域、版本、启动时间和选举时间。
