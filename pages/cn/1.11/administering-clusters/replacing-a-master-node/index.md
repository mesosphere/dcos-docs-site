---
layout: layout.pug
navigationTitle: 替换管理节点
title: 替换管理节点
menuWeight: 800
excerpt: 替换现有 DC/OS 集群中的管理节点

enterprise: true
---

<!-- This source repo for this topic is https://github.com/mesosphere/dcos-docs-site -->


您可以替换现有 DC/OS 集群中的管理节点。一次只能替换一个管理节点。

### 删除现有管理节点

开始时只需关闭您想替换的管理节点。

### 添加新的管理节点

添加新管理节点以替换在上一步中下线的管理节点的步骤非常简单。

#### `master_discovery: static`

如果您在 config.yaml 中配置了静态管理节点发现（即
`master_discovery: static`），则新服务器必须具有与旧服务器一样的内部 IP
地址。

再次确认新服务器具有与旧服务器相同的内部 IP 地址
之后，旧服务器就完全无法从集群中访问了
您可以按正常方式继续安装新的管理节点。

#### `master_discovery: master_http_loadbalancer`

如果您在 config.yaml 中配置了动态管理节点发现（即
`master_discovery: master_http_loadbalancer`），只需按正常方式安装
新的管理节点。

### 检查新管理节点是否健康

为确认新的管理节点已成功加入集群，您在继续之前，必须验证该程序是否成功。

该程序与管理节点升级后执行的验证程序相同。

确切步骤参见升级文档 [升级管理节点] (/1.11/installing/production/upgrading/#dcos-masters) 中的“验证升级”部分。
