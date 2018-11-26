---
layout: layout.pug
navigationTitle: 在 DC/OS 上练习部署调试方案
title: 在 DC/OS 上练习部署调试方案
excerpt: 教程 - 在 DC/OS 上练习部署调试方案
menuWeight: 31
---

<!-- IV. Hands On Examples Section -->

<a name=hands-on></a>

# 在 DC/OS 上练习部署调试

在本部分中，有三种基本的调试方案可供练习。我们建议您在跳到解决方案之前尝试在没有解决方案的情况下调试这些方案。

## 先决条件

* 正在运行的 [DC/OS 集群](/cn/1.11/installing/oss/)
 - 4 个专用代理节点
 - 1 个公共代理节点
- 已配置的 [DC/OS CLI](https://docs.mesosphere.com/1.11/cli/install/)

请注意，这些练习需要正在运行的 [DC/OS 集群](/cn/1.11/installing/) 和已配置的 [DC/OS CLI](https://docs.mesosphere.com/1.11/cli/install/)。我们还将使用具有 4 个专用代理节点和 1 个公共代理节点的集群，该公共代理节点**尚未运行任何先前的工作负载**。当然，如果使用替代集群设置，您的结果可能会有所不同。
