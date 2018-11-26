---
layout: layout.pug
navigationTitle: 开发
title: 开发
menuWeight: 5
excerpt: 安装 DC/OS 进行开发和测试
---

以下工具自动执行本地安装 DC/OS 以进行开发和测试：

- [DC/OS Vagrant](https://github.com/dcos/dcos-vagrant/)——在虚拟节点上使用 Vagrant 和 VirtualBox 的 DC/OS
- [DC/OS Docker](https://github.com/dcos/dcos-docker/)——在容器化节点上使用 Docker 的 DC/OS

您选择其中一个而非另一个的原因有好几个：

- DC/OS Vagrant 适用于 Windows、Mac 或 Linux，而 DC/OS Docker 要求使用 Mac 或 Linux。
- DC/OS Docker 的部署速度明显快很多（5 分钟左右，而非 15 分钟左右）。
- DC/OS Vagrant 通过指定分配给每个节点资源来更准确地模拟真实集群，而 DC/OS Docker 允许超额预订您的机器资源。
- DC/OS Docker 在发布过程中更稳定，因为它只要求使用 Docker，而不是同时使用 Vagrant 和 VirtualBox。

要使用 DC/OS Enterprise 的这两个工具之一，请联系销售代表或 <a href="mailto:sales@mesosphere.com">sales@mesosphere.com</a>，获取 DC/OS Enterprise 安装工具。[enterprise type="inline" size="small" /]
