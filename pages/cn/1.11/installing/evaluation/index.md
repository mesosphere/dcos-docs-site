---
layout: layout.pug
navigationTitle: 评估
title: 评估
menuWeight: 10
excerpt: 安装 DC/OS 以评估云或本地基础架构
---

本页支持 DC/OS OSS（默认）和 DC/OS Enterprise 安装方法。可以根据自己的要求评估 DC/OS 集群的安装。

**注意：** 下列安装方法尚未正式获得 Mesosphere 支持，但由 DC/OS 社区支持。联系 [邮寄列表](https://groups.google.com/a/dcos.io/forum/#!forum/users) 或 [Slack 渠道](http://chat.dcos.io/?_ga=2.226911897.58407594.1533244861-1110201164.1520633201)，获取社区支持。

# 安装方法的类型

根据您的要求使用以下安装方法。
 
## 云安装 
云安装方法用于快速演示和验证概念。

DC/OS CloudFormation 模板仅供参考，因为以下限制不推荐用于生产用途：
- CloudFormation 不允许在自动扩展组内进行协调的零停机就地更新。
- CloudFormation 不允许自动扩展组的自动零停机更换。
- 更换 DC/OS 代理节点需要对有状态服务的本地存储卷进行手动数据迁移。
- 对 AWS CloudFormation 的 DC/OS 更新尚未完成自动化、验证或记录。
- 经过修改的 CloudFormation 模板不受 Mesosphere，Inc.支持。

采用以下方法安装 DC/OS：
- [在 Amazon Web Services (AWS) 上提供 DC/OS](/cn/1.11/installing/evaluation/cloud-installation/aws/) ：使用 AWS CloudFormation 上的 DC/OS 模板为 Amazon Web Services (AWS) 创建 DC/OS 集群。
- [在 Azure 上提供 DC/OS](/cn/1.11/installing/evaluation/cloud-installation/azure/)：使用 Azure 资源管理器模板在 Azure 上安装 DC/OS 集群。
- [在 Google 云端平台 (GCE) 上提供 DC/OS](/cn/1.11/installing/evaluation/cloud-installation/gce/)：使用安装脚本在 Google 计算引擎 (GCE) 上安装 DC/OS 集群。此安装方法不支持升级。

**注意：** 安装可以就地升级的生产就绪的 DC/OS 的推荐方法是使用 [生产安装] (/1.11/installing/production/deploying-dcos/installation/) 方法。

## 本地安装 
本地安装使用各种方法安装 DC/OS。
