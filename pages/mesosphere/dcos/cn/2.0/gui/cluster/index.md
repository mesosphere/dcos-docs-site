---
layout: layout.pug
navigationTitle:  群集
title: 群集
menuWeight: 8
excerpt: 使用群集菜单
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---

从 UI，您可以查看单个群集或 [链接群集] 统计信息的摘要(/mesosphere/dcos/2.0/administering-clusters/multiple-clusters/cluster-links/)。

# 概述

要查看群集配置详细信息的显示，请单击 **群集 > 概述**。

![群集概述](/mesosphere/dcos/2.0/img/GUI-Cluster-Overview.png)

图 1 - 群集概述

此视图显示一般详情、Mesos 详情、Marathon 详情，以及有关 Bootstrap 配置的信息。

您可以从右上角的下拉菜单中看到群集的 IP 地址。

![群集菜单](/mesosphere/dcos/2.0/img/GUI-Cluster-Menu.png)

图 2 - 群集菜单

# 链接群集 [enterprise type="inline" size="small" /]

多群集用于隔离（例如，测试与生产）、适应地理分布等等情境。DC/OS 多群集操作可让操作员和用户轻松管理和访问多个 DC/OS 群集。
 
要查看链接群集详细信息的显示，请单击 **链接群集**。


![链接群集](/mesosphere/dcos/2.0/img/GUI-Cluster-Linked-Clusters-Tab-Link.png)

图 3 - 链接群集

有关链接群集的详细信息，请参阅 [多个群集](/mesosphere/dcos/2.0/administering-clusters/multiple-clusters/cluster-links/) 文档。


