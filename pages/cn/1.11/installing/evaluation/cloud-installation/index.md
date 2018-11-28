---
layout: layout.pug
excerpt: 用于概念演示和验证的云安装
title: 云安装选项
navigationTitle: 云安装 
menuWeight: 5
---

云安装方法用于测试或演示 Azure、AWS、GCE、Digital Ocean 或 Packet 上的 DC/OS。这些集群无法升级。
DC/OS CloudFormation 模板仅供参考，因为以下限制不推荐用于生产用途：
- CloudFormation 不允许在自动扩展组内进行经协调的零停机就地的更新。
- CloudFormation 不允许自动扩展组的自动零停机更换。
- 更换 DC/OS 代理节点需要对有状态服务的本地存储卷进行手动数据迁移。
- 对 AWS CloudFormation 的 DC/OS 更新尚未完成自动化、验证或记录。
- Mesosphere, Inc. 不支持经过修改的 CloudFormation 模板。

可以使用 [生产安装](/cn/1.11/installing/production/) 方法安装功能齐全的集群。

**注意：** 云安装方法尚未正式获得 Mesosphere 支持，但由 DC/OS 社区支持。联系 [邮寄列表](https://groups.google.com/a/dcos.io/forum/#!forum/users) 或 [Slack 渠道](http://chat.dcos.io/?_ga=2.226911897.58407594.1533244861-1110201164.1520633201)，获取社区支持。
