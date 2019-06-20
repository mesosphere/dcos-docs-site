---
layout: layout.pug
navigationTitle: 替换管理节点
title: 替换管理节点
menuWeight: 800
excerpt: 替换现有 DC/OS 群集中的管理节点
enterprise: true
---



您可以替换现有 DC/OS 群集中的管理节点。一次只能替换一个管理节点。

## 删除现有管理节点

开始时，关闭您想替换的管理节点。

## 添加新的管理节点

添加新管理节点以替换在上一步中下线的管理节点的步骤非常简单。

### `master_discovery: static`

如果已在 `config.yaml` 中配置静态管理节点发现（例如，`master_discovery: static`），则新服务器必须具有与旧服务器相同的内部 IP 地址。只要验证新服务器与旧服务器具有相同的内部 IP 地址，并且完全无法从群集中访问旧服务器，您就可以像平常一样继续安装新服务器。

### `master_discovery: master_http_loadbalancer`

如果已在 config.yaml 中配置了动态管理节点发现（例如，`master_discovery: master_http_loadbalancer`），则按正常方式安装新的管理节点。

## 确认新管理节点是否运行良好

要确认新的管理节点已成功加入群集，您在继续之前，必须验证该步骤是否成功。该步骤与管理节点升级后执行的验证步骤相同。

确切步骤参见 [升级文档](/cn/1.12/installing/production/upgrading/) 中 [升级管理节点](/cn/1.12/installing/production/upgrading/#dcos-masters) 部分的“验证升级”。
