---
layout: layout.pug
navigationTitle: 节点类型
title: 节点类型
menuWeight: 1
excerpt: 了解三种节点
enterprise: false
---

DC/OS 节点是 DC/OS 组件运行所在的虚拟机或物理机。DC/OS 节点联网以形成 DC/OS 群集。DC/OS 群集由三种节点组成：管理节点、专用代理节点和公共代理节点。

我们建议您使用在不同网络（专用、公共、主控）中设置的不同类型节点，如图 1 所示。

![DC/OS 节点类型](/mesosphere/dcos/1.12/img/node-types-redesigned.png)

图 1 - DC/OS 节点类型

使用特定于节点类型的防火墙设置保护群集免受外部影响。

<p class="message--note"><strong>注意：</strong>不同节点之间的内部通信必须尽可能开放：</p>

- 每个节点均须具有从本身到 DC/OS 群集中所有节点的不受限制 IP 至 IP 连接。
- 所有端口都应打开，以进行从管理节点到代理节点的通信，反之亦然。
- 不建议在任何类型的节点之间设置防火墙规则。

## 管理节点

DC/OS 管理节点是一个可与其他管理节点配合使用以管理群集其他部分的节点。管理节点包含大量的 DC/OS 组件，包括 Mesos 管理节点进程。

### 受保护区域

根据分配、部署方法和基础架构配置，管理节点可以公开访问或位于限制访问权限的网络区域以提高安全性。常见策略包括限制管理节点访问您办公室的 IP 范围以及需要 [VPN](https://en.wikipedia.org/wiki/Virtual_private_network) 访问。

### 高可用性

多个管理节点共同工作，带来高可用性和容错性。您可以使用只有一个管理节点的群集进行开发，但此群集可用性不高，可能无法从故障中恢复。

### 首要节点选举

Mesos 执行 [首要节点选举](https://en.wikipedia.org/wiki/Leader_election) 并将传入流量路由至当前首要节点，以确保一致性。跟 Mesos 一样，几个其他 DC/OS 管理节点组件执行独立的首要节点选举。这意味着，不同组件（如 Marathon 和 ZooKeeper）的首要节点可能位于不同的管理节点。

### Quorum

为保持一致性，必须始终连接 quorum 数量（半数加一）的管理节点。例如，具有三个管理节点允许一个管理节点出故障；具有五个管理节点允许两个管理节点出故障，以允许在滚动更新过程中出故障。可添加额外的管理节点，以提高风险承受力。

只能在安装过程中指定管理节点的数量。这主要是因为改变在不同节点上具有首要节点的多个组件的法定数量和配置很复杂。

## 代理节点

DC/OS 代理节点是用户任务运行所在的节点。代理节点包含几个 DC/OS 组件，包括 Mesos 代理节点进程。代理节点可以是公共或专用的，具体取决于代理和网络配置。

### 公共代理节点

公共代理节点是位于网络上的代理节点，允许通过群集的 [基础架构网络](/mesosphere/dcos/cn/1.12/overview/concepts/#infrastructure-network) 从群集外部进入。

公共代理节点上的资源默认配置为仅分配给指定 `slave_public` 角色的任务。公共代理节点上的 Mesos 代理节点还具有 `public_ip:true` 代理属性以协助其发现。

公共代理节点主要用于面向外部的反向代理负载均衡器，如 Marathon-LB。这样便提供了 [DMZ](https://en.wikipedia.org/wiki/DMZ_%28computing%29)，可以减少恶意攻击者能够访问的表面积。

群集通常只有几个公共代理节点，因为几个负载均衡器通常可以处理多个服务代理。

### 专用代理节点

专用代理节点是位于网络上的代理节点，不允许通过群集的 [基础架构网络](/mesosphere/dcos/cn/1.12/overview/concepts/#infrastructure-network) 从群集外部访问。

专用代理节点上的资源默认配置为允许无差别的分配。更准确地说，资源被提供给 `*` 角色，从而允许将其分配给未指定角色的任务。有关详细信息，请参阅 [Mesos 资源角色](http://mesos.apache.org/documentation/latest/roles/)。

因为这些资源无差别，因此大多数任务都安排在专用代理节点上且无法从群集外部访问，从而减少恶意攻击者可访问的表面积。所以，群集一般由大部分专用代理节点组成。同样，大部分 [Mesosphere Universe](/mesosphere/dcos/cn/1.12/overview/concepts/#mesosphere-universe) 包默认安装在专用代理节点上。

## 更多信息

有关管理节点组件和代理节点组件的更多信息，请参阅 [组件](/mesosphere/dcos/cn/1.12/overview/architecture/components/)。

有关安全的更多信息，请参阅 [保护您的群集](/mesosphere/dcos/cn/1.12/administering-clusters/securing-your-cluster/)。

有关扩展群集的更多信息，请参阅 [添加代理节点](/mesosphere/dcos/cn/1.12/administering-clusters/add-a-node/)。

有关配置公共节点的更多信息，请参阅 [转换代理节点类型](/mesosphere/dcos/cn/1.12/administering-clusters/convert-agent-type/)。
