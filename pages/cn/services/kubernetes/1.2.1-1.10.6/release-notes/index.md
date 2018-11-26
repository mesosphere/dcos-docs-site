---
layout: layout.pug
navigationTitle: 版本注释
title: 版本注释 1.2.1-1.10.6
menuWeight: 120
excerpt: 此版本的发行说明
---


# 版本 1.2.1-1.10.6

## 升级通知

* **强烈建议** 运行 `1.2.0-1.10.5` 之前版本的用户遵循
 [升级](../upgrade)文档中全新 **更新 `1.2.0-1.10.5` 之前版本中的包选项** 部分
 所述的步骤。

## 废弃通知

* Kubernetes API 的不安全端口正在弃用，并将在未来版本中永久禁用。

## 改进

* Kubernetes v1.10.6. 
* `dcos-commons` v0.52.1. 
* 添加了一个新的配置属性，允许您为公用节点指定保留的资源。

## 错误修复

* 修复了一个漏洞，该漏洞在某些情况下可能会导致
 某个强制加载项无法安装。
* 修复了一个漏洞，该漏洞会因为 
 请求的 9.x.x.x/25 范围内无可用地址而阻止 CNI 分配 pod IP
* 修复了一个漏洞，该漏洞可能会导致 `kube-node` 和 `kube-node-public` 任务
 需要花费比预计更多的时间来被标记为已准备就绪。
* 修复了一个漏洞，该漏洞可能会导致某些命令
 在文件夹下（例如， `prod/kubernetes`）安装包时出现错误。

## 文档

* 更新文档以解释新配置属性的使用`kubernetes.public_reserved_resources`。

## 已知问题

* 支持 XFS 文件系统（RHEL 7.2 及更高版本），但只有 `d_type=true`
 被启用。使用 `xfs_info` 来验证 `ftype` 选项被设置为 `1`。
 要正确格式化 XFS 文件系统，请使用标签 `-n ftype=1`。
* 不支持在创建集群后关闭 `kubernetes.high_availability` 
 选项的值。
* 当 `kubernetes.high_availability` 被禁用时，替换 `etcd` 或 `kube-node` pod
 可能会导致永久数据丢失。
* 节点当前被限制为每个可用 CPU 核心运行 10 个 pod，
 每节点最多运行 100 个 pod。这在未来的
 版本中可进行配置。
* 不支持在安装包之后更改 `kubernetes.authorization_mode` 选项的值。
