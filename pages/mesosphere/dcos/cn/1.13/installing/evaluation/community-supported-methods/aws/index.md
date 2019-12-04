---
layout: layout.pug
title: AWS
navigationTitle: AWS
menuWeight: 5
excerpt: 使用 AWS CloudFormation 上的模板为 Amazon Web Services 安装 DC/OS 群集
model: /mesosphere/dcos/1.13/data.yml
render: mustache
---

<p class="message--warning"><strong>免责声明：</strong>这是<a href="https://github.com/dcos/terraform-dcos/tree/master/aws">社区推动的项目</a>，未正式获得 Mesosphere 支持。这种安装方法用于快速演示和验证概念。本页说明如何使用 Terraform 在 AWS 上安装 DC/OS 群集。Terraform 仅供参考，不建议用于生产目的。下列安装方法不支持升级。</p>

<p class="message--note"><strong>注意：</strong>联系<a href="https://groups.google.com/a/dcos.io/forum/#!forum/users">邮寄列表</a>或 <a href="http://chat.dcos.io/?_ga=2.226911897.58407594.1533244861-1110201164.1520633201">Slack 渠道</a>，获取社区支持。</p>

可以使用 AWS CloudFormation 上的 DC/OS 模板为 Amazon Web Services (AWS) 创建 DC/OS 群集。

[message type="warning"]<strong>免责声明：</strong>DC/OS CloudFormation 模板仅供参考，因为以下限制不推荐用于生产用途：

- CloudFormation 不允许在自动扩展组内进行协调的零停机就地更新。
- CloudFormation 不允许自动扩展组的自动零停机更换。
- 更换 DC/OS 代理节点需要对有状态服务的本地存储卷进行手动数据迁移。
- 对 AWS CloudFormation 的 DC/OS 更新尚未完成自动化、验证或记录。
- Mesosphere, Inc. 不支持经过修改的 CloudFormation 模板。

安装可以就地升级的生产就绪型 DC/OS 的推荐方法是使用 [安装方法](/mesosphere/dcos/cn/{{ model.folder_version }}/installing/production/deploying-dcos/installation/)。
[/message]
