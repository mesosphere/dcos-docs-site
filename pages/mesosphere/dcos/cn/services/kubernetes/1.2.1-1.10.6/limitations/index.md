---
layout: layout.pug
navigationTitle: 限制
title: 限制
menuWeight: 60
excerpt: DC/OS Kubernetes 安装包限制
---


目前，DC/OS Kubernetes 包具有以下限制：

* 不支持 Mesos 角色。
* 每个 DC/OS 集群只能有 **1** 个 Kubernetes 集群。
* 每个 DC/OS 代理只能有 **1** 个 Kubernetes 节点。
* 如果 `kube-proxy` 在请求起源的同一 DC/OS 代理上运行，那么 DC/OS 和 Mesos 任务只能访问 Kubernetes 服务 。
* Kubernetes、`etcd` 和 Docker 版本不可配置。
* 不支持外部 `etcd` 集群。
* 仅 AWS 存在云提供商集成。
* 默认情况下，基于自定义度量的水平 Pod 自动扩展不可用。
* DC/OS UI 与 Kubernetes 仪表板之间没有集成。
* 不支持在创建集群后关闭 `kubernetes.high_availability` 
 选项的值。
* 当 `kubernetes.high_availability` 被禁用时，替换或永久丢失 `etcd` pod 将导致永久数据丢失。
* 节点被限制为每个可用 CPU 核心只能运行 10 个 pod，每个节点最多运行 100 个 pod。
* 不支持在安装包之后更改 `kubernetes.authorization_mode` 选项的值。
