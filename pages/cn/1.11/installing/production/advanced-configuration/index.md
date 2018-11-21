---
layout: layout.pug
navigationTitle: 高级配置
title: 高级配置
menuWeight: 15
excerpt: 使用高级配置方法设置 DC/OS
---

此页面显示高级配置方法的话题。

采用 YAML 格式在 `config.yaml` 文件中指定 DC/OS 配置参数。此文件存储在 [bootstrap 节点] 上(/1.11/installing/production/system-requirements/#bootstrap-node) 并在 DC/OS 安装期间使用以生成自定义 DC/OS 构造。

**注意：** 如果您想在安装后修改配置文件，就必须遵循 [DC/OS 升级流程](/cn/1.11/installing/production/upgrading/)。

