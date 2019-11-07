---
layout: layout.pug
navigationTitle:  组件
title: 组件
menuWeight: 9
excerpt: 使用组件菜单
渲染：胡须
型号：/mesosphere/dcos/2.0/data.yml
---

“组件”选项卡显示 DC/OS 组件的快照。它显示了组件的名称和运行状况。

![Components](/mesosphere/dcos/2.0/img/GUI-Components-Main_View.png)

图 1 - 组件选项卡

## 运行状况检查

此屏幕显示每个组件的名称和运行状况。您可以按健康或不健康的组件对列表进行筛选。有关运行状况检查的更多信息，请参阅 [运行状况检查文档](/mesosphere/dcos/2.0/deploying-services/creating-services/health-checks/)。

### 运行状况报告

从“组件”屏幕，单击 **下载快照** 按钮下载运行状况报告。

## 详细信息 

如果单击列表中某个组件的名称，您便可以在“组件详情”屏幕中查看详细信息。此屏幕将显示运行状况、节点以及该组件中每个节点的角色。

![组件详情](/mesosphere/dcos/2.0/img/GUI-Components-Detail.png)

图 2 - 组件详情

如果单击节点 ID，您便可以看到节点的任务和输出状态的摘要。

![节点详情](/mesosphere/dcos/2.0/img/GUI-Components-Detail-2.png)

图 3 - 节点详情

有关系统组件的更多信息，请参阅 [组件管理文档](/mesosphere/dcos/2.0/administering-clusters/component-management/)。
