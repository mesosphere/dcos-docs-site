---
layout: layout.pug
title: 部署 DC/OS
navigationTitle: 部署 DC/OS
menuWeight: 10
excerpt: 在生产就绪环境中部署 DC/OS
---

# 生产安装概述 

生产安装方法用于安装可升级的生产就绪 DC/OS。使用这种方法，您可以打包 DC/OS 并手动连接到每个节点，以运行 DC/OS 安装命令。若要与现有系统集成，或者您没有群集的 SSH 访问权限，则推荐使用这种安装方法。

DC/OS 安装进程需要 bootstrap 节点、管理节点、公共代理节点和专用代理节点。可以查看 [节点](/mesosphere/dcos/1.12/overview/concepts/#node) 文档以了解更多信息。

安装 DC/OS 群集需要以下步骤：

* 配置 bootstrap 节点
* 在管理节点上安装 DC/OS
* 在代理节点上安装 DC/OS

![Production Installation Process](/mesosphere/dcos/1.12/img/advanced-installer.png)

图 1. 生产安装流程


此安装方法要求：

* bootstrap 节点必须是可从群集节点访问的网络。
* bootstrap 节点必须从群集节点打开 HTTP(S) 端口。

