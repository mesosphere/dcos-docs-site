---
layout: layout.pug
navigationTitle: 软件定义网络
title: 软件定义网络
menuWeight: 4
excerpt: 了解 SDN 的 DC/OS 支持
enterprise: false
---


DC/OS 允许在各种软件定义网络 (SDN) 上启动 UCR 和 Docker 容器。它支持 UCR 的 [容器网络接口 (CNI)](https://github.com/containernetworking/cni) 标准和 Docker 的 [容器网络模型 (CNM)](https://github.com/docker/libnetwork/blob/master/docs/design.md) 标准。

DC/OS 附带自己的本地虚拟网络解决方案，称为 [DC/OS 覆盖层](/cn/1.11/networking/SDN/dcos-overlay/)，支持 CNI 和 CNM 标准。

## Docker 容器的 IPv6 支持
在 DC/OS 1.11 中，DC/OS 覆盖层设有内置支持，支持创建 Docker 容器的 IPv6 网络。

**注意**：IPv6 支持目前仅适用于 Docker 容器，不适用于 UCR 容器。
