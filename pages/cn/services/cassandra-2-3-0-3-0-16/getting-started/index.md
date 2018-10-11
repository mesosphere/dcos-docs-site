---
layout: layout.pug
navigationTitle:
excerpt: Getting started with Cassandra
title: Getting Started
menuWeight: 10
model: /services/cassandra/data.yml
render: mustache
---

开始使用 DC/OS {{ model.techName }} 服务的测试实例非常简单。

## 先决条件

- 根据您在企业 DC/OS 中的安全模式，在安装之前，您可能需要 [配置服务帐户](/services/cassandra/2.3.0-3.0.16/security/#provisioning-a-service-account)。具有`superuser` 权限的人员才可以创建服务帐户。
 - `strict` [安全模式](/latest/security/ent/#security-modes) 需要服务帐户。
 - `permissive` 安全模式中服务帐户可选。
 - `disabled` 安全模式不需要服务帐户。
- 您的群集必须至少有 {{ model.install.minNodeCount }} 专用节点。
{{ model.install.customRequirements }}

#include /cn/services/include/getting-started.tmpl
