---
layout: layout.pug
title: 安装
menuWeight: 30
excerpt: 安装 Enterprise 和开源版本 DC/OS
---

# 介绍 Mesosphere Universal 安装工具

现在，Mesosphere Universal 安装工具是受支持的 AWS、Azure 和 GCP 上的 DC/OS 安装方法。云安装指南从简短的演示开始，使您的第一个群集启动和运行。从那里，您可以轻松地开始修改演示安装，使之变成生产群集 — 全都来自于相同的设置和设备。


##### 跳转至您的云提供程序的入门指南：

#### [Amazon Web Services](/mesosphere/dcos/1.12/installing/evaluation/aws/)

#### [Azure 资源管理器](/mesosphere/dcos/1.12/installing/evaluation/azure/)

#### [Google Cloud Platform](/mesosphere/dcos/1.12/installing/evaluation/gcp/)


## 关于 Mesosphere Universal 安装工具

使用 [Mesosphere Universal 安装工具](/mesosphere/dcos/1.12/installing/evaluation/) 在 Amazon Web Services (AWS)、Azure 资源管理器 (AzureRM) 和 Google Cloud Platform (GCP) 上部署 DC/OS。Mesosphere Universal 安装工具构建于 Terraform 之上，后者是一种开源基础架构自动化工具，使用模板来管理多个公共云提供商、服务提供商和本地解决方案的基础架构。通过 Mesosphere Universal 安装工具，您可以快速、轻松地创建基础架构，配置资源，管理代理之间的通信。诸如扩展群集或升级到更新版本的 DC/OS 之类的操作现在非常容易。入门模板允许快速安装 DC/OS，但可以扩展到包括升级在内的完整生产环境，甚至不让群集发生停顿。


## 本地安装

[本地安装](/mesosphere/dcos/1.12/installing/production/) 用于安装适用于数据中心的生产就绪 DC/OS。这种方法之前被称为自定义安装。它涉及打包 DC/OS 分发并手动连接到每个节点，以运行 DC/OS 安装命令。若要与现有系统集成，或者您没有群集的 SSH 到群集的访问权限，则推荐使用这种方法。
