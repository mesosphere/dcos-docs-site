---
layout: layout.pug
navigationTitle:  什么是 DC/OS
title: 什么是 DC/OS？
menuWeight: 1
excerpt: 了解 DC/OS
render: mustache
model：/mesosphere/dcos/2.0/data.yml
enterprise: false
---

作为分布式系统，DC/OS 本身就是分布式系统、群集管理器、容器平台和操作系统。

## 分布式系统

作为分布式系统，DC/OS 包括由一组由管理节点协调的一组代理节点。与其他分布式系统一样，管理节点上运行的几个组件与其他组件一起执行 [领导者选举](https://en.wikipedia.org/wiki/Distributed_computing#Coordinator-election)。

## 群集管理器

作为群集管理器，DC/OS 管理在代理节点上运行的资源和任务。代理节点向群集提供资源。这些资源然后被捆绑到资源邀约中，并向注册的调度器提供。调度器随后接受这些邀约，并将其资源分配给特定任务，从而间接地将任务放在特定代理节点上。代理节点然后产生大量执行器来管理每种任务类型，执行器运行并管理分配给它们的任务。不同于外部群集调配器，DC/OS 在群集中运行并对其启动的任务进行生命周期管理。此群集管理功能主要由 [Apache Mesos] 提供(/mesosphere/dcos/2.0/overview/concepts/#apache-mesos)。

## 容器平台

作为容器平台，DC/OS 包括两个内置任务调度器（Marathon 和 DC/OS 作业 (Metronome)），以及两个容器运行时（Docker 和 Mesos）。此功能结合起来通常被称为容器编排。除了用于服务和作业的内置调度器以外，DC/OS 还支持自定义调度器处理更复杂应用程序特定的运算逻辑。数据库和消息队列等有状态服务通常利用这些自定义调度器来处理高级情形，例如设置、拆卸、备份、恢复、恢复、同步和重新均衡。

DC/OS 上的所有任务均容器化。容器可以从容器存储库（如 Docker Hub(https://hub.docker.com/)）下载的镜像开始，或者它们可以是运行时的本机可执行文件（例如二进制文件或脚本）。虽然每个节点上目前需要 Docker，但随着组件和转件包转移到使用镜像和本地工作负载用的 Mesos 通用容器运行时，这在以后可能会变得可选。

## 操作系统

作为操作系统，DC/OS 可以提取群集硬件和软件资源，并为应用程序提供常见服务。除群集管理和容器编排功能以外，这些常见服务还提供包管理、网络、日志记录和度量标准、存储和卷以及身份管理。

与 Linux 系统类似，DC/OS 具有系统空间（也称为内核空间）和用户空间。系统空间是用户无法访问的受保护区域，涉及资源分配、安全和进程隔离等低级别操作。用户空间是用户应用程序、作业和服务所在的位置。内置包管理器可用于将服务安装到用户空间。

与 Linux 系统不同，DC/OS 不是 [主机操作系统](/mesosphere/dcos/2.0/overview/concepts/#host-operating-system)。DC/OS 涉及多台机器，但依靠每台机器取得自己的主机操作系统和主机内核。
