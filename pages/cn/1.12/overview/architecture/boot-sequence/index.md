---
layout: layout.pug
navigationTitle: 启动顺序
title: 启动顺序
menuWeight: 6
excerpt: 了解 DC/OS 组件服务启动顺序
enterprise: false
---

安装期间，DC/OS 组件服务全部同时启动。由于相互依赖性，组件服务然后初始化并以相对一致的顺序变得有响应。DC/OS 诊断服务监控组件服务和节点运行状况。当所有组件服务都运行良好时，节点将标记为良好。

## 管理节点

以下是每个管理节点上 DC/OS 组件服务的启动顺序。

1. DC/OS 诊断启动
 1. 轮询 `systemd` 以获取组件状态
 1. 报告节点运行状况不佳，直到所有组件（`systemd` 服务）都运行良好
 1. 报告群集运行状况不佳，直到所有管理节点都运行良好
1. Exhibitor 启动
 1. 创建 ZooKeeper 配置并启动 ZooKeeper
1. Mesos 管理节点启动
 1. 向本地 ZooKeeper 注册
 1. 发现来自 ZooKeeper 的其他 Mesos 管理节点
 1. 选择首要管理节点
1. Mesos-DNS 启动
 1. 发现首要 Mesos 管理节点（从 ZooKeeper 或本地 `mesos-master`）
 1. 轮询首要 Mesos 管理节点了解群集状态
1. 网络组件启动
 1. 将 DNS 查找转发给 Mesos-DNS
 1. 初始化 VIP 转换
 1. 初始化覆盖网络
1. 容器编排组件启动
 1. 向本地 ZooKeeper 注册
 1. 选择首要管理节点
 1. 发现来自 Mesos-DNS 的首要 Mesos 管理节点
 1. 首要节点向首要 Mesos 管理节点注册
1. 日志记录和 Metrics 标准组件启动
1. 安全组件启动
1. Admin Router 启动
 1. 发现来自 Mesos-DNS 的首要 Mesos 管理节点
 1. 发现来自 Mesos-DNS 的首要 Marathon
 1. 将未授权流量重定向到认证组件
 1. 代理到已发现组件的 API 和 GUI 流量
 1. 代理到 DC/OS 服务的管理服务流量
 1. 服务 DC/OS GUI

## 代理节点

以下是每个代理节点上 DC/OS 组件的启动顺序。

1. DC/OS 诊断启动
 1. 轮询 `systemd` 以获取组件状态
 1. 报告节点运行状况不佳，直到所有组件（`systemd` 服务）都运行良好
1. Mesos 代理节点启动
 1. 发现来自 ZooKeeper 的首要 Mesos 管理节点
 1. 向首要 Mesos 管理节点注册
 1. 首要 Mesos 管理节点使用已注册的代理 IP 连接到新的代理
 1. 首要 Mesos 管理节点开始为新任务向调度器提供新代理的资源
 1. DC/OS API、GUI 和 CLI 中的新 DC/OS 节点可见
1. 网络组件启动
 1. 将 DNS 查找转发给 Mesos-DNS
 1. 初始化 VIP 转换
 1. 初始化覆盖网络
1. 日志记录和 Metrics 标准组件启动
1. Admin Router 代理节点启动
 1. 发现来自 Mesos-DNS 的首要 Mesos 管理节点
 1. 代理内部 API 流量到已发现组件的

## 服务

在 DC/OS 安装和初始化完成之后，您可以安装 DC/OS 服务。您可以从 Mesosphere Universe 或直接从 Marathon 通过 DC/OS 包管理来安装服务。

以下是 DC/OS 服务的启动顺序：

1. 首要 Mesos 管理节点为 Marathon 提供代理节点资源
1. 首要 Marathon 将服务调度到具有足够资源的代理节点上
1. Mesos 代理节点启动作为一个或多个容器化任务的服务

### 调度器服务

某些 DC/OS 服务也是与 DC/OS 交互以管理任务的调度器。

以下是 DC/OS 调度器服务的启动顺序：

1. 首要 Mesos 管理节点为 Marathon 提供代理节点资源
1. 首要 Marathon 将服务调度到具有足够资源的代理节点上
1. Mesos 代理节点启动作为一个或多个容器化任务的服务
1. 调度器服务发现来自 Mesos-DNS 的首要 Mesos 管理节点
1. 调度器服务向首要 Mesos 管理节点注册
1. 首要 Mesos 管理节点开始为新调度器服务提供代理节点资源

### 更多信息

有关任务和服务的更多信息，请参阅 [分布式进程管理](/cn/1.12/overview/architecture/distributed-process-management/)。
