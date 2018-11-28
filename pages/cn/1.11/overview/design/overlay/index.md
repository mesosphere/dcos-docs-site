---
layout: layout.pug
excerpt: 了解网络覆盖拓扑
title: DC/OS 覆盖网络
navigationTitle: 覆盖网络
menuWeight: 5
---

从网络的角度来看，若要提供类似于虚拟机环境所提供的最终用户体验，重要的是为每个容器提供自己的 IP 地址和网络命名空间。为容器提供隔离的网络堆栈可以确保逻辑网络隔离以及容器之间的网络性能隔离。另外，每容器 IP 允许您使用传统的网络操作工具 (traceroute、tcpdump、wireshark) 和您所熟悉的进程，并帮助您在调试网络连接/性能问题方面提高效率。从操作的角度来看，识别容器特定流量也变得更容易，从而简化了对容器的网络性能和安全策略的实施。

DC/OS 的默认每容器 IP 解决方案需要与运行 DC/OS 的网络无关。因此，为实现每容器 IP，我们需要使用虚拟网络。覆盖技术使容器网络拓扑与底层主机网络无关。此外，覆盖技术提供了容器流量与主机流量的完全隔离，使得对容器流量的策略执行更简单。实现覆盖技术的挑战是容器发送和接收流量时封装和解封容器流量的成本。为了最小化这些封装和解封操作对容器网络吞吐量的影响，覆盖技术必须将封装/解封操作作为内核中数据包处理流水线的一部分。

为了利用覆盖技术实现 DC/OS 的每容器 IP 解决方案，因此我们需要选择 Linux 系统内核主动支持的覆盖技术。Linux 系统内核支持的最常见覆盖技术是 VxLAN。

DC/OS 的覆盖技术设计有以下假设：

- 由于集中式 IPAM 缺乏对可用性和可靠性的保证，我们无法使用集中式 IPAM。
- 我们需要避免第 2 层的泛滥，使网络可扩展。这意味着我们不能依赖广播 ARP 来获取容器的 MAC 地址。
- 解决方案需要支持统一容器化工具 (`MesosContainerizer`) 和 `DockerContainerizer`。在同一个覆盖网络上，我们应当能够同时运行 Docker 和 Mesos 容器，并允许它们相互通信。

在本文档中，基于上述假设/约束，我们介绍了 DC/OS 中控制平面的软件架构，其可实现基于 VxLAN 的第 3 层覆盖。

在介绍软件架构之前，我们介绍了解释覆盖技术操作方面的数据包流程，这有助于建立对软件架构中所述各种组件的直观认识。

## 使用中的 DC/OS 覆盖网络

图 1 显示了 VxLAN 配置完成后，在 `MesosContainerizer` 和 Docker 上运行的容器的代理配置：

![VxLAN 配置完成后，在 `MesosContainerizer` 和 Docker 上运行的容器的代理配置。](/cn/1.11/img/overlay-fig-1.png)

图 1. 代理配置 

我们可以用一个示例来阐释覆盖网络的运行。图 1 显示的是双代理 DC/OS 集群。为了让 DC/OS 覆盖网络工作，我们需要分配一个足够大的子网，为覆盖网络上运行的容器分配地址。选定的地址空间不能覆盖主机网络的地址空间，以防止在设置覆盖网络时出现任何错误配置。在图 1 中，主机网络的地址空间为 10.0.0.0/8，为覆盖网络选择的地址空间为 9.0.0.0/8。

理想情况下，我们希望 IPAM 为覆盖网络上的所有容器执行地址分配。然而，很难通过全球 IPAM 来解决可靠性和一致性问题。例如，当代理宕机时，我们如何通知 IPAM？ IPAM 应该提供多大的可用性来保证集群的 99% 正常运行时间（没有正常运行时间 IPAM 容器就无法运行）？ 鉴于全球 IPAM 引发的复杂性，我们选择采用更简单的架构，将地址空间划分为较小的块，并允许代理节点拥有这些块。在图 1 中，9.0.0.0/8 的空间已被拆分为 /24 子网，每个子网都由代理负责。代理 1 分配有 9.0.1.0/24，代理 2 分配有 9.0.2.0/24。

鉴于该代理有一个 /24 子网，子网需要进一步拆分成更小的块，因为 Mesos 代理节点可能需要同时启动 Mesos 容器和 Docker 容器。与代理一样，我们可以在 Mesos 容器和 Docker 容器之间进行静态地址分配。此例中，我们将 /24 空间静态地刻画成了一个 /25 空间，分别用于 Mesos 容器和 Docker 容器。此外，请注意，Mesos 容器由 `MesosContainerizer` 在“m-dcos”网桥上启动，Docker 容器由 `DockerContainerizer` 使用 Docker 守护程序在“d-dcos”网桥上启动。下面我们看一下数据包在容器到容器通信过程中的流转过程。

### 同一主机上的容器到容器通信

假设 9.0.1.0/25 上的 Mesos 容器想要与 9.0.1.128/25 上的 Docker 容器通信。数据包流转如下：
- 9.0.1.0/25 上的容器将数据包发送到默认网关，此示例中为“m-dcos”网桥，分配了 IP 地址 9.0.1.1/25。
- m-dcos 网桥将处理数据包，由于 m-dcos 网桥存在于主机网络命名空间中，因此它将向网络堆栈发送数据包以进行路由。
- 数据包将被发送到 d-dcos，它将数据包切换到 9.0.1.128/25 子网。

<a name="container-to-container-different-hosts"></a>
### 不同主机上的容器到容器通信

假设 9.0.1.0/25（代理 1）上的 Mesos 容器想要与 9.0.2.128/25（代理）上的 Docker容器通信。数据包流转如下：
- 来自 9.0.1.0/25 的数据包将被发送到“m-dcos”网桥 (9.0.1.1/25) 上的默认网关。该网桥将处理数据包并将其发送到网络堆栈。由于网桥已在主机网络命名空间中，数据包将使用主机网络命名空间路由表进行路由。
- 主机路由表中存在一条路由 9.0.2.0/24 -> 44.128.0.2（将在下一节说明如何安装此路由），这实质上是告诉主机为发送此数据包，您需要通过 VxLAN1024 来发送（也有 44.128.0.0/20 -> VxLAN1024 的路由条目）。
- 由于 44.128.0.2 直接连接在 VxLAN1024 上，内核会尝试对 44.128.0.2 进行 ARP 解析。在配置覆盖网络期间，DC/OS 会在 ARP 缓存中为 VTEP 端点 44.128.0.2 安装一个条目，因此内核 ARP 查找会成功。
- 内核路由模块会将目标 MAC 设置为**70:B3:D5:00:00:02**的数据包发送给 VxLAN 设备VxLAN1024。
- 要转发数据包，VxLAN1024 需要一个为**70:B3:D5:00:00:01** 的MAC地址作为密钥的条目。VxLAN 转发数据库中的此条目由 DC/OS 进行编程，指向代理 2 的 IP 地址。DC/OS 能够对此条目进行编程的原因是因为它知道代理的 IP 和所有代理上存在的 VTEP。
- 此时，数据包封装在 UDP 报文头（由 VxLAN FDB 指定）中，并被发送到存在于代理 2 的 VTEP。
- 代理 2 上的 VxLAN1024 对数据包进行解封，由于目标 MAC 地址设置为代理 2 上 VxLAN1024 的 MAC 地址，因此该数据包将由代理 2 上的 VxLAN1024 进行路由。
- 在代理 2 中，路由表具有子网 9.0.2.128/25 的条目，直接连接到网桥“d-dcos”。因此，数据包将被转发到连接至“d-dcos”网桥的容器进行处理。

<a name="challenges"></a>
### 挑战


从 [不同主机上的容器到容器通信] 的数据包步骤中明显可知(/1.11/overview/design/overlay/#container-to-container-different-hosts) ，为了让 DC/OS 覆盖网络运行，有几个元数据需要预先配置到代理中，以便进行路由和切换正常工作。在这里，我们将列出 DC/OS 覆盖网络所需的信息。

- 在 DC/OS 中，我们需要一个 SAM（子网分配模块），该模块将通知已分配给其的子网的代理。
- 在代理中，我们需要一个实体，该实体为 Docker 守护程序配置了子网（图 1，9.0.1.128/25 网络）中已分配给 Docker 守护程序的那部分。
- 在代理中，我们需要一个实体，该实体将 IP 地址分配给由 `MesosContainerizer` 启动的容器（图 1，9.0.1.0/25 网络）。
- 在 DC/OS 中，我们需要一个实体，该实体将使用所有代理上存在的所有 VTEP 的 MAC 地址，以及正确封装数据包所需的解封信息（代理 IP、UDP 端口），为每个代理上的 VxLAN 转发数据库编程。该实体还需要用所有 VTEP 的 MAC 地址对每个代理进行 ARP 缓存编程，以获得其对应的 IP 地址。

只有解决这些挑战，才能让 DC/OS 覆盖网络运行。我们将在下一节介绍 DC/OS 覆盖网络控制平面的软件架构。控制平面将对 [挑战] 一节列出的元数据(/1.11/overview/design/overlay/#challenges) 进行配置和编程，以使其正常运行。

## 软件架构

![DC/OS 覆盖网络控制平面的软件架构。](/cn/1.11/img/overlay-fig-2.png)

图 2. DC/OS 覆盖网络控制平面的软件架构

图 2 描述了我们将实现的用于为 DC/OS 覆盖网络构建控制平面的软件架构。图中橙色的块是必须构建的缺失组件。下面，我们来介绍所提供的每个缺失的组件和功能。

### Mesos 的 DC/OS 模块

此流程的代码可参见 [DC/OS 覆盖网络的 Mesos 模块](https://github.com/dcos/dcos-mesos-modules/tree/master/overlay)。

要配置底层 DC/OS 覆盖网络，需要一个可以为每个代理分配子网的实体。该实体还需要配置 Linux 系统网桥，以便在自己的子网中启动 Mesos 和 Docker 容器。另外，每个代理上的 VTEP 需要分配有 IP 地址和 MAC 地址，并且代理上的路由表需要配置正确的路由，以便容器通过 DC/OS 覆盖网络进行通信。

我们将通过拥有两个 Mesos 模块（一个管理 DC/OS 模块和一个代理 DC/OS 模块）来满足对 DC/OS 覆盖网络的上述所有要求。这两个模块的职责如下：

#### 主控 Mesos 覆盖模块：

主控模块将作为 Mesos 管理节点的一部分运行，具有以下职责：
1. 它负责为每个代理分配子网。我们将更详细地描述主控模块将如何使用复制日志来定点检查此信息在故障切换至新的管理节点时是否恢复。
2. 它将侦听代理覆盖模块以注册和恢复为其分配的子网。代理覆盖模块还将使用此端点了解分配给它的覆盖子网（在多个虚拟网络的情况下）、分配给覆盖网络中每个 Mesos 和 Docker 网桥的子网，以及分配给它的 VTEP IP 和 MAC 地址。
3. 它通过 HTTP 端点 `overlay-master/state` 来展示 DC/OS 中所有虚拟网络的状态。此端点的响应由以下 protobuf 支持：https://github.com/dcos/mesos-overlay-modules/blob/master/include/overlay/overlay.proto#L86

#### 代理 Mesos 覆盖模块：

代理覆盖模块作为 Mesos 代理节点的一部分运行，具有以下职责：
1. 负责向主覆盖模块注册。注册后，它将检索分配的代理子网、分配给其 Mesos 和 Docker 网桥的子网，以及 VTEP信息（VTEP 的 IP 和 MAC 地址）。
2. 基于分配的代理子网，负责生成为 `MesosContainerizer` 用于 `network/cni` 隔离器的 CNI（容器网络接口）网络配置。
3. 负责创建 Docker 网络，以供 `DockerContainerizer` 使用。
4. 揭示 HTTP 端点 `overlay-agent/overlays`，虚拟网络服务使用该端点检索有关该特定代理上覆盖网络的信息。

### 使用复制日志协调管理节点上的子网分配：

为了让 `MesosContainerizer` 和 `DockerContainerizer` 启动给定子网上的容器，Mesos 代理节点需要学习分配给自己的子网。另外，该子网需要在 `MesosContainerizer` 或 `DockerContainerizer` 开始前得到学习。

主覆盖模块将负责分配子网、VTEP IP 以及与 VTEP 关联的 MAC 地址。尽管分配新的子网和缓存此信息本身很简单，但在管理节点故障切换过程中始终维持这些信息则具有挑战性。为了让此信息在管理节点故障切换过程中持续存在，主覆盖模块将使用 [Mesos 复制日志](http://mesos.apache.org/documentation/latest/replicated-log-internals/ "Mesos Documentation")。允许在管理节点故障切换完成后，主覆盖网络模块定点检查此信息并将其恢复的算法如下：
1. 每当新的代理覆盖模块在管理模块注册时，管理模块将尝试为 VTEP 分配的新子网、新 VTEP IP 和新 MAC 地址到已注册的代理模块。但是，它不会用分配的信息对注册请求作出响应，直到此信息被成功写入复制日志。
2. 故障切换时，管理模块会读取复制日志并重新创建子网、VTEP IP 和 VTEP MAC 地址信息，并在内存中构建此分配信息的缓存。
3. 如果在管理节点故障切换期间中途收到注册请求，代理覆盖模块的注册请求将失败。在这种情况下，代理覆盖模块负责定位新的管理节点并尝试使用新管理节点上的覆盖模块进行注册。

### 设置 `MesosContainerizer` 和 `DockerContainerizer` 以使用分配的子网。

一旦 DC/OS 模块从管理 DC/OS 模块检索子网信息，它将执行以下操作，以允许 `MesosContainerizer` 和 `DockerContainerizer` 在覆盖网络上启动容器：

对于 `MesosContainerizer`，DC/OS 模块可在指定位置生成 CNI 配置。CNI 配置将具有网络/cni 隔离器的网桥信息和 IPAM 信息，以便在 `m-<virtual network name>` 网桥上配置容器。

对于 `DockerContainerizer`，DC/OS 模块将检索子网，然后创建规范名为 `d-` 的 `docker network`，<virtual network name>。它将使用以下 Docker 命令来操作：

```sh
docker network create \
--driver=bridge \
--subnet=<CIDR> \
--opt=com.docker.network.bridge.name=d-<virtual network name>
--opt=com.docker.network.bridge.enable_ip_masquerade=false
--opt=com.docker.network.driver.mtu=<overlay MTU>
<virtual network name>
```

**注意：** 让 `DockerContainerizer` 与 DC/OS 覆盖网络协同工作的假设是主机在 Docker v1.11 或更高版本上运行。

**注意：** 默认 `<overlay MTU>` = 1420 字节。

### 虚拟网络服务：覆盖网络编排

此过程的代码可以在 https://github.com/dcos/navstar.git 找到。

虚拟网络服务 (Virtual Network Service) 是在每个代理上运行的覆盖编排服务。它是一个系统，包含 DC/OS 覆盖网络的非实时组件以及其他与网络相关的 DC/OS 服务模块。在每个代理上运行的虚拟网络服务负责以下功能：

- 与代理覆盖网络模块对话，获取分配给代理的子网、VTEP IP 和 MAC 地址。
- 在代理上创建 VTEP。
- 对到各个代理上的各个子网的路由进行编程。
- 使用 VTEP IP 和 MAC 地址对 ARP 缓存进行编程。
- 使用 VTEP MAC 地址和隧道端点信息对 VxLAN FDB 进行编程。
- 使用 [Lashup](https://github.com/dcos/lashup/ "GitHub repository")（一个分布式 CRDT 存储）可靠地将代理覆盖网络信息传播到集群中的所有代理。这是虚拟网络服务执行的最重要的功能之一，因为只有拥有集群中所有代理的全部信息，虚拟网络服务才能对所有代理上的所有覆盖子网的每个代理进行路由。
