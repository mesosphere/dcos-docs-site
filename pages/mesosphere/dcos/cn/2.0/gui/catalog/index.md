---
layout: layout.pug
navigationTitle: 目录
title: 目录
menuWeight: 4
excerpt: “目录”页面显示在 DC/OS 上运行的所有服务
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---

{{ model.packageRepo }} 页面显示所有可用的 DC/OS&trade; 服务。只需单击即可在 DC/OS {{ model.packageRepo }} 中安装包。可以使用默认设置安装包，或直接在用户界面中自定义安装。

# 包类型

D2iQ&reg; 提供两种服务包：认证和社区。

## 认证包

已认证的包经过 D2iQ 验证，可与 DC/OS 互操作。

![认证包](/mesosphere/dcos/2.0/img/GUI-Catalog-Certified-Services-1_14.png)

图 1 - 认证包


支持这些认证包的文档可在 [DC/OS 服务文档页面] 找到(/mesosphere/dcos/services/)。

## 社区包

社区包由 D2iQ 合作伙伴和开源社区的成员贡献。它们没有被 D2iQ 验证为可与 DC/OS 互操作。但是，它们可以提供在认证 {{ model.packageRepo }} 中不可获得的许多功能。新包为定期提供。其中有些包在 [DC/OS 服务文档页面](/mesosphere/dcos/services/) 提供 Mesosphere 特定的文档。

![包](/mesosphere/dcos/2.0/img/GUI-Catalog-Community-Packages-1_14.png)

图 2 - 社区包

# 搜索 {{ model.packageRepo }}

您可以在页面顶部的搜索框中搜索整个 {{ model.packageRepo }}。

![搜索框](/mesosphere/dcos/2.0/img/GUI-Catalog-Search-1_14.png)

图 3 - 搜索框

# 从 {{ model.packageRepo }} 安装

您可以运行您创建的 DC/OS 服务，或从 {{ model.packageRepo }} 安装包。创建的服务和从 {{ model.packageRepo }} 安装的服务在运行时都会显示在 DC/OS UI 的 [服务](/mesosphere/dcos/2.0/gui/services/) 选项卡上。

安装服务的快速简单方式是从 {{ model.packageRepo }} 页面安装。

1. 导航到 DC/OS UI 中的 [**{{ model.packageRepo }}**](/mesosphere/dcos/2.0/gui/catalog/) 选项卡。

 ![认证包](/mesosphere/dcos/2.0/img/GUI-Catalog-Certified-Services-1_14.png)

 图 4 - {{ model.packageRepo }} 选项卡

1. 单击一个包。
    
1. 查看安装前说明（若有）。确保您的群集符合列出的要求。单击 **审查并运行**。
    
1. 根据需要编辑配置。

1. 再次单击 **查看并运行**，检查您的配置。当您满意时，单击 **运行服务**。

1. 从 [服务](/mesosphere/dcos/2.0/gui/services/) 选项卡查看部署的服务。

 ![服务部署](/mesosphere/dcos/2.0/img/GUI-Services-Running_Services_View-1_12.png)

 图 5 - 服务部署

有关从 {{ model.packageRepo }} 安装、配置和部署服务的更多信息，请参阅 [部署服务文档](/mesosphere/dcos/2.0/deploying-services/#dcos-services)。

