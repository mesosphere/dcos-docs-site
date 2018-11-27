---
layout: layout.pug
navigationTitle: 组件管理
title: 组件管理
menuWeight: 5
excerpt: 安装和管理 DC/OS 组件服务

enterprise: false
---

组件管理 API 控制 DC/OS 组件服务的安装和管理。

在安装、升级和卸载期间，DC/OS 安装程序会使用该 API。它不适用于 DC/OS 用户的操作。

## 组件包管理器

DC/OS 组件包管理器 (Pkgpanda) 实施组件管理 API，并在所有 DC/OS 节点上运行。

[Pkgpanda](https://github.com/dcos/dcos/tree/master/pkgpanda) 由两部分组成：包构建器和包管理器。

-**包构建器** 在 DC/OS 版本构建过程中，从源代码和预编译工件构建和捆绑组件包。
-**包管理器** 作为 DC/OS 的一部分，并在每个节点上运行，管理该节点上已安装和激活的组件包。

包构建器构建的组件包在每个发行版本的 DC/OS 中是安装程序的一部分。安装程序将组件包发送到每个节点，并编排组件管理 API 以安装它们。组件包包含一个或多个 systemd 服务定义、二进制文件和配置文件。


## 组件健康状况

组件健康状况由 DC/OS 诊断组件监控。有关组件监控的更多信息，请参阅[监控](/cn/1.11/monitoring/)。


## 组件日志

组件日志被发送到 journald 并被 DC/OS Log 组件公开。有关组件日志的详细信息，请参阅 [日志记录](/cn/1.11/monitoring/logging/)。


## 路由

组件管理 API 通过 Admin Router 和 Admin Router Agent 在所有节点上 `/pkgpanda/` 路径下公开。


## 资源

[swagger api='/1.11/api/pkgpanda.yaml']
