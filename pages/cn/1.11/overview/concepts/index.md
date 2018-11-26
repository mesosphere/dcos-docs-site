---
layout: layout.pug
navigationTitle: 概念
title: 概念
menuWeight: 5
excerpt: 了解 DC/OS 概念和术语

enterprise: false
---

DC/OS 由许多开源组件构成，其中多个在 DC/OS 之前就存在。本文档中使用的术语可能与您熟悉的已有术语相似，但它们可能在 DC/OS 中以不同方式使用。

# <a name="dcos"></a>DC/OS

DC/OS 是数据中心的 [分布式操作系统](https://en.wikipedia.org/wiki/Distributed_operating_system)。

与传统的分布式操作系统不同，DC/OS 还是管理基于本地可执行文件或容器镜像（如 [Docker 镜像]）的容器化任务的容器平台(https://docs.docker.com/engine/tutorials/dockerimages/)。同样与传统 [操作系统] (https://en.wikipedia.org/wiki/Operating_system) 不同，DC/OS 是在 [节点集群](#cluster) 上而不是在单台机器上运行的。每个 DC/OS 节点还具有管理底层机器的 [主机操作系统](#host-operating-system)。

DC/OS 由许多组件构成，尤其是分布式系统内核 ([Mesos](#apache-mesos)) 和容器编排引擎 ([Marathon](#marathon))。

在版本 1.6 之前，DC/OS 被称为数据中心操作系统 (DCOS)。使用版本 1.6，平台被重命名为 DC/OS，并开源化了。虽然 DC/OS 本身是开源，但像 [Mesosphere DC/OS Enterprise](https://mesosphere.com/product/) 等高级分布可能包括其他闭源组件和功能，例如多租户、细粒度权限、密钥管理和端对端加密。

## <a name="dcos-gui"></a>DC/OS GUI

[DC/OS 图形用户界面 (GUI)](/cn/1.11/gui/) 是用于从网页浏览器远程控制和管理 DC/OS 集群的界面。GUI 有时也被称为 DC/OS UI 或 DC/OS Web 界面。

## <a name="dcos-cli"></a>DC/OS CLI

[DC/OS 命令行界面 (CLI)](/cn/1.11/cli/) 是从终端远程控制和管理 DC/OS 集群的界面。

# <a name="dcos-cluster"></a>集群

DC/OS 集群是一组联网的 DC/OS 节点，具有共识机制的管理节点以及任意数量的公共和/或专用代理节点。

# <a name="network"></a>网络

DC/OS 有两种类型的网络：基础架构网络和虚拟网络。

## <a name="infrastructure-network"></a>基础架构网络

基础架构网络是由 DC/OS 运行所在的基础架构提供的物理或虚拟网络。DC/OS 并不管理或控制此网络层，但是需要它才能让 DC/OS 节点进行通信。

## <a name="dcos-virtual-network"></a>虚拟网络

DC/OS 虚拟网络具体来说是集群内部的虚拟网络，连接在 DC/OS 上运行的 DC/OS 组件和容器化任务。

- DC/OS 提供的虚拟网络是由虚拟网络服务 (Navstar) 管理的 VXLAN。
- 虚拟网络必须由管理员配置，然后才能被任务使用。
- DC/OS 上的任务可以选择加入到特定虚拟网络上，并被给予容器特定的 IP。
- 虚拟网络允许对在 DC/OS 上运行的任务进行逻辑细分。
- 虚拟网络上的每个任务都可以用可选地址组配置，这几乎隔离了与同一网络和地址组上任务的通信。

# <a name="dcos-node"></a>节点

DC/OS 节点是 Mesos 代理节点和/或 Mesos 管理节点进程运行所在的虚拟机或物理机。DC/OS 节点联网以形成 DC/OS 集群。

## <a name="dcos-master-node"></a>管理节点

DC/OS 管理节点是一个虚拟机或物理机，运行一系列协同工作的 DC/OS 组件来管理集群的其他部分。

- 每个管理节点都包含多个 DC/OS 组件，尤其包括 [Mesos 管理节点](#mesos-master) 进程。
- 管理节点在 [共识机制] 中工作(https://en.wikipedia.org/wiki/Quorum_%28distributed_computing%29)，以实现集群协调的一致性。要避免 [脑裂](https://en.wikipedia.org/wiki/Split-brain_%28computing%29) 集群分区，集群的管理节点数应始终为奇数。例如，具有三个管理节点允许一个管理节点出故障；具有五个管理节点允许两个管理节点出故障，允许在滚动更新过程中出故障。可添加额外的管理节点，以提高风险承受力。
- 只有一个管理节点的集群可用于开发，但可用性不高，可能无法从故障中恢复。

## <a name="dcos-agent-node"></a>代理节点

DC/OS 代理节点是 Mesos 任务运行所在的虚拟机或物理机。

- 每个代理节点都包含多个 DC/OS 组件，尤其包括 [Mesos 代理节点](#mesos-agent) 进程。
- 代理节点可以是 [专用的](#private-agent-node) 或 [公共的](#public-agent-node)，具体取决于代理和网络配置。

如需更多信息，请参阅 [网络安全](/cn/1.11/administering-clusters/) 和 [添加代理节点](/cn/1.11/administering-clusters/add-a-node/)。

# <a name="private-agent-node"></a>专用代理节点

专用代理节点是位于网络上的代理节点，**不允许**通过集群的基础架构网络从集群外部访问。

- 每个专用代理节点上的 Mesos 代理节点默认配置为不将其资源分配给任何特定 Mesos 角色 (`*`)。
- 大多数服务包默认安装在专用代理节点上。
- 集群一般大部分由专用代理节点组成。

# <a name="public-agent-node"></a>公共代理节点

公共代理节点是位于网络上的代理节点，**允许**通过集群的基础架构网络从集群外部访问。

- 每个公共代理节点上的 Mesos 代理节点配置有 `public_ip:true` 代理属性及其分配给 `slave_public` 角色的所有资源。
- 公共代理节点主要用于面向外部的反向代理负载均衡器，如 [Marathon-LB](/cn/1.11/networking/marathon-lb/)。
- 集群通常只有几个公共代理节点，因为单个负载均衡器通常可以处理多个代理服务。

如需更多信息，请参阅 [转换代理节点类型](/cn/1.11/administering-clusters/convert-agent-type/)。

- <a name="host-operating-system"></a>[主机操作系统]

主机操作系统是一个 [操作系统](https://en.wikipedia.org/wiki/Operating_system)，在 DC/OS 组件下的每个 DC/OS 节点上运行，管理本地硬件和软件资源，并提供运行其他程序和服务的普通服务。

- DC/OS 目前支持以下主机操作系统：

- [CentOS](https://www.centos.org/)
- [RHEL](https://www.redhat.com/en/technologies/linux-platforms/enterprise-linux)
- [CoreOS](https://coreos.com/)

主机操作系统管理本地任务和机器资源，DC/OS 则管理集群任务和资源，使得您不需要与节点上的主机操作系统进行交互。

# <a name="bootstrap-machine"></a>Bootstrap 机

bootstrap 机是配置、构建和发布 DC/OS 安装程序工件的机器。

- bootstrap 机在技术上不被视为是集群的一部分，因为它没有安装 DC/OS。对于大多数安装方法，必须可以通过基础架构网络来对集群中的机器进行 bootstrap 节点来回的访问。
- bootstrap 机有时用作跳转盒来控制 SSH 访问集群中的其他节点，以提高安全性和日志记录。
- 允许管理节点更改 IP 的一种方法涉及在 bootstrap 机上运行 ZooKeeper并使用 Exhibitor。其他替代方案包括使用 S3、DNS 或静态 IP，具有各种权衡需要考虑。如需更多信息，请参阅 [配置 Exhibitor 存储后端](/cn/1.11/installing/production/advanced-configuration/configuration-reference/#exhibitor-storage-backend)。
- 如果管理主节点 IP 更改不需要使用 bootstrap 机或将其作为 SSH 跳转盒，可在启动后将其关闭并按需运行以 [添加新节点](/cn/1.11/administering-clusters/add-a-node/) 到集群。

如需更多信息，请参阅 [系统要求](/cn/1.11/installing/production/system-requirements/#bootstrap-node)。

# <a name="dcos-service"></a>服务

DC/OS 服务是一组或多个服务实例，可以作为一个组启动和停止，并在停止前退出时自动重启。

- 服务目前是一个 DC/OS GUI 抽象，可转换为 CLI 和 API 中的 Marathon 应用程序和 Pod。这种区分将随着名称“服务”往上游推送到组件 API 而随时间变化改变。
- 有时“服务”也可以指主机操作系统上的 `systemd` 服务。这些通常被视为组件，实际上不在 Marathon 或 Mesos 上运行。
- 服务可以是系统服务或者用户服务。这种区分是新的并且随着命名空间转换为系统范围的第一类模式而不断发展。

## <a name="marathon-service"></a>Marathon 服务

Marathon 服务由零个或多个容器化服务实例组成。每个服务实例由一个或多个容器化 Mesos 任务组成。

- Marathon 应用程序和 Pod 均被视为服务。
 - Marathon 应用程序实例与任务一对一映射。
 - Marathon 应用程序实例与任务一对多映射。
- 服务实例在提前退出时作为新的 Mesos 任务重新启动。
- 如果服务实例提前退出且代理节点已关闭或不再有足够的资源，则可能会重新安排到另一个代理节点上。
- 服务可通过 [DC/OS API (Marathon)](/cn/1.11/deploying-services/marathon-api/) 直接安装，或者从 [Mesosphere Universe](#mesosphere-universe) 等 [软件包存储库](#dcos-package-registry) 通过 [DC/OS 包管理器 (Cosmos)](#package-manager) 间接安装。可以使用 [DC/OS GUI](#dcos-gui) 和 [DC/OS CLI](#dcos-cli) 更轻松地与 DC/OS 包管理器 (Cosmos) 交互。
- Marathon 服务可以是 [DC/OS 调度器](#dcos-scheduler)，但并非所有服务都是调度器。
- Marathon 服务是围绕 Marathon 服务实例的抽象，后者是围绕 Mesos 任务的抽象。DC/OS 作业 (Metronome) 或 Jenkins 等其他调度器有自己的名称，用于围绕 Mesos 任务的抽象。

**示例：** Cassandra（调度器）、Marathon-on-Marathon、Kafka（调度器）、Nginx、Tweeter。

## <a name="systemd-service"></a>`Systemd`服务

`systemd` 服务包含单个可选的容器化机器操作系统进程，在管理节点或代理节点上运行，由 `systemd` 管理，由 DC/OS 本身拥有。

- 所有 `systemd` 服务目前是主机操作系统服务、DC/OS 依赖关系、DC/OS 组件或系统管理员手动管理的服务。

**示例：** 大多数 DC/OS 组件、（系统）Marathon。

## <a name="system-service"></a>系统服务

系统服务是一项实现或增强 DC/OS 本身功能的服务，作为 Marathon 服务或 `systemd` 服务运行，由系统（管理员）用户或 DC/OS 本身拥有。

- 系统服务可能需要特殊权限才能与其他系统服务进行交互。
- 在 DC/OS Enterprise 集群上作为系统服务运行的权限需要特定的细粒度权限，而在开放的 DC/OS 上，所有登录用户都有相同的管理权限。

**示例：** 所有 DC/OS 组件。

## <a name="user-service"></a>用户服务

用户服务是非系统服务的 Marathon 服务，它由系统的用户拥有。

这种区分是新的，并且随着命名空间转换为系统范围的第一类模式，并映身到细粒度用户和用户组权限而不断发展。

**示例：** Jenkins、Cassandra、Kafka、Tweeter。

# <a name="dcos-service-group"></a>服务组

DC/OS 服务组是用于命名空间和组织的分级式（路径式）DC/OS 服务集合。

- 服务组目前仅适用于 Marathon 服务，不适用于 `systemd` 服务。
- 这种区分可能随着命名空间转换为系统范围的第一类模式而改变。

# <a name="dcos-job"></a>作业

DC/OS 作业是一组类似的短期作业实例，作为 Mesos 任务运行，由 DC/OS 作业 (Metronome) 组件管理。可创建一个作业以仅运行一次，也可以按计划定期运行。

# <a name="dcos-scheduler"></a>调度器

DC/OS 调度器是一个 Mesos 调度器，在管理节点上作为 `systemd` 服务运行，在代理节点上作为 Mesos 任务运行。

DC/OS 调度器和 Mesos 调度器之间的主要区别在于它运行的位置和安装的方式。
- 某些调度器预先安装为 DC/OS 组件（例如，Marathon、DC/OS 作业 (Metronome)）。
- 某些调度器可以由用户作为用户服务安装（例如，Kafka、Cassandra）。
- 某些调度器作为多个服务实例运行，以提供高可用性（例如，Marathon）。

在 DC/OS Enterprise 中的某些安全模式下，DC/OS 调度器必须使用服务账户在 Mesos 注册为框架来认证身份并获得授权。

# <a name="dcos-scheduler-service"></a>调度器服务

DC/OS 调度器服务是作为 DC/OS 服务运行的长期 DC/OS 调度器（Marathon 或 `systemd`）。由于 DC/OS 调度器也可以作为短期任务运行，因此并非所有调度器都是服务。

# <a name="dcos-component"></a>组件

DC/OS 组件是与 DC/OS 一起发布的 DC/OS 系统服务。

- 组件可以是 `systemd` 服务或 Marathon 服务。
- 组件可以以高可用性的配置部署。

大多数组件在管理节点上运行，但有些组件 (likr mesos-agent) 在代理节点上运行。

**示例：** Mesos、Marathon、Mesos-DNS、Bouncer、Admin Router、DC/OS 包管理器 (Cosmos)、历史服务等。

# <a name="dcos-package"></a> 软件包

DC/OS 包是指元数据捆绑包，描述如何使用 Marathon 来配置、安装和卸载 DC/OS 服务。

# <a name="dcos-package-manager"></a> 软件包管理器

[DC/OS 包管理器 (Cosmos)(https://github.com/dcos/cosmos)) 是管理在 DC/OS 集群上安装和卸载软件包的一个组件。

- DC/OS GUI 和 DC/OS CLI 充当与 DC/OS 包管理器交互的客户端。
- [DC/OS 包管理器 API](https://github.com/dcos/cosmos) 允许进行程序化交互。

# <a name="dcos-package-registry"></a> 软件包注册表

DC/OS 包注册表是 DC/OS 包的存储库。[DC/OS 包管理器](#dcos-package-manager) 可以被配置为可以安装来自一个或多个软件包注册表的安装软件包。

# <a name="mesosphere-universe"></a>Mesosphere Universe

Mesosphere Universe 是由 Mesosphere 管理的一个公共包注册表。

如需更多信息，请参阅 GitHub 上的 [Universe 存储库](https://github.com/mesosphere/universe)。

- <a name="container-registry"></a>[容器注册表]

容器注册表是预建容器镜像的存储库。[Universal 容器运行时](#mesos-containerizer-universal-container-runtime) 和 [Docker 引擎](#Mesker-containerizer-docker-engine) 都可以从公共或专用 Docker 容器注册表运行 Docker 镜像。

# <a name="cloud-template"></a>云模板

云模板是声明性描述 DC/OS 集群的一种基础架构特定方法。

如需更多信息，请参阅 [云安装选项](/cn/1.11/installing/evaluation/cloud-installation/)。


# <a name="mesos-concepts"></a>Mesos 概念

以下术语在谈到 Apache Mesos 时根据上下文是正确的，但可能会被 DC/OS 中的其他抽象所隐藏。

- [Apache Mesos](#apache-mesos)
- [管理节点](#mesos-master)
- [代理节点](#mesos-agent)
- [任务](#mesos-task)
- [执行器](#mesos-executor)
- [调度器](#mesos-scheduler)
- [框架](#mesos-framework)
- [角色](#mesos-role)
- [资源邀约](#mesos-resource-offer)
- [容器化工具](#mesos-containerizer)
 - [通用容器运行时](#mesos-containerizer-universal-container-runtime)
 - [Docker 引擎](#mesos-containerizer-docker-engine)
- [Exhibitor &amp; ZooKeeper](#mesos-exhibitor-zookeeper)
- [Mesos\-DNS](#mesos-dns)

## <a name="apache-mesos"></a>Apache Mesos

Apache Mesos 是一个分布式系统内核，可管理集群资源和任务。Mesos 是 DC/OS 的核心组件之一，先于 DC/OS 本身，为平台带来成熟性和稳定性。

如需更多信息，请参阅 [Mesos 网站](http://mesos.apache.org/)。

## <a name="mesos-master"></a>管理节点

Mesos 管理节点是在管理节点上运行的一个进程，以协调集群资源管理并促进任务编排。

- Mesos 管理节点构成共识机制并选举首要节点。
- 首要 Mesos 管理节点收集 Mesos 代理节点报告的资源，并向 Mesos 调度器作出资源邀约。调度器然后可以接受资源邀约，并将任务置于其相应节点上。

## <a name="mesos-agent"></a>代理节点

Mesos 代理节点是在代理节点上运行的一个进程，以管理该节点的执行器、任务和资源。

- Mesos 代理节点注册节点的部分或全部资源，允许首要 Mesos 管理节点向调度器提供这些资源，调度器则决定运行任务的节点。
- Mesos 代理节点将任务状态更新报告给首要 Mesos 管理节点，后者则将其报告给相应的调度器。

## <a name="mesos-task"></a>任务

Mesos 任务是一个抽象的工作单位，由 Mesos 执行器进行生命周期管理，在 DC/OS 代理节点上运行。任务通常是进程或线程，但可以只是单线程队列中的内联代码或项目，具体取决于其执行器的设计方式。Mesos 内置命令执行器将每个任务作为一个进程运行，可以由多个 [Mesos 容器化工具](#mesos-containerizer) 的一个进行容器化。

# <a name="mesos-executor"></a>执行器

Mesos 执行器是 Mesos 代理节点启动任务的一种方法。Mesos 任务由其调度器定义，由特定执行器（或默认执行器）运行。每个执行器都在自己的容器中运行。

有关框架调度器和执行器的更多信息，请参阅 [应用框架开发指南](http://mesos.apache.org/documentation/latest/app-framework-development-guide/)。

## <a name="mesos-scheduler"></a>调度器

Mesos 调度器是定义新的 Mesos 任务并为其分配资源（将其放在特定节点上）的程序。调度器收到描述 CPU、RAM 等的资源邀约，并分配给可由 Mesos 代理节点启动的离散任务。调度器必须在 Mesos 注册为框架。

**示例：** Kafka、Marathon、Cassandra。

## <a name="mesos-framework"></a>框架

Mesos 框架包括调度器、任务和可选的自定义执行器。术语“框架”和“调度器”有时可以互换使用。在 DC/OS 的情况下，我们更喜欢使用“调度器”。

有关框架调度器和执行器的更多信息，请参阅 [应用框架开发指南](http://mesos.apache.org/documentation/latest/app-framework-development-guide/)。

## <a name="mesos-role"></a>角色

Mesos 角色是一组 Mesos 框架，共享保留的资源、持久卷和配额。这些框架也在 Mesos 的层次主导资源公平性 (DRF) 份额计算中分为一组。角色通常与资源组混淆，这是由于它们在代理节点上静态配置的方式。分派实际上是反向的：资源被分派给角色。角色资源分配可以在 Mesos 代理节点上静态配置，或者使用 Mesos API 在运行时更改。

## <a name="mesos-resource-offer"></a>资源邀约

Mesos 资源邀约从代理节点向调度器提供一组未分配的资源（如 CPU、磁盘、内存），以便调度器可将这些资源分配给一个或多个任务。资源邀约由首要 Mesos 管理节点构建，但资源本身由各代理节点报告。

## <a name="mesos-containerizer"></a>Containerizer

Containerizer 提供围绕特定容器运行时间的容器化和资源隔离抽象。受支持的运行时为

- 通用容器运行时
- Docker 引擎

## <a name="mesos-containerizer-universal-container-runtime"></a>通用容器运行时

通用容器运行时通过二进制可执行文件和 Docker 镜像启动 Mesos 容器。通用容器运行时管理的 Mesos 容器并不使用 Docker 引擎，即使是从 Docker 镜像启动。

### <a name="mesos-containerizer-docker-engine"></a>Docker 引擎

[Docker 引擎](https://www.docker.com/products/docker-engine) 从 Docker 镜像启动 Docker 容器。

## <a name="mesos-exhibitor-zookeeper"></a>Exhibitor 和 ZooKeeper

Mesos 取决于 ZooKeeper，后者是管理集群状态的高性能协调服务。Exhibitor 自动配置和管理 [管理节点](#master-node) 上的 ZooKeeper。

## <a name="mesos-dns"></a>Mesos-DNS

Mesos-DNS 是一个 DC/OS 组件，可在集群内提供服务发现。Mesos-DNS 允许在 Mesos 上运行的应用程序和服务通过使用域名系统 (DNS) 找到彼此，与服务在整个互联网中发现彼此的方式相似。

如需更多信息，请参阅 [Mesos-DNS 文档](/cn/1.11/networking/mesos-dns/)。

# <a name="marathon-concepts"></a>Marathon 概念

以下术语在谈到 Marathon 时根据上下文是正确的，但可能会被 DC/OS 中的其他抽象所隐藏。

- [Marathon](#marathon)
- [应用程序](#marathon-application)
- [Pod](#marathon-pod)
- [组](#marathon-group)

## <a name="marathon"></a>Marathon

Marathon 是 Mesos 和 DC/OS 的容器编排引擎。Marathon 是 DC/OS 的核心组件之一，先于 DC/OS 本身，为平台带来成熟性和稳定性。

如需更多信息，请参阅 [Marathon 网站](https://mesosphere.github.io/marathon/)。

## <a name="marathon-application"></a>应用程序

Marathon 应用程序是一个长期运行的服务，可能有一个或多个实例与 Mesos 任务一对一映射。用户通过为 Marathon 提供应用定义 (JSON) 来创建应用程序。然后，Marathon 将一个或多个应用程序作为 Mesos 实例来调度，具体取决于指定了多少定义。应用程序目前支持使用

- [Mesos 通用容器运行时](#mesos-containerizer-universal-container-runtime)，或
- [Docker 引擎](#mesos-containerizer-docker-engine)

## <a name="marathon-pod"></a>Pod

Marathon Pod 是一个长期运行的服务，可能有一个或多个实例与同地协作的 Mesos 任务一对多映射。以 JSON 文件格式为 Marathon 提供 Pod 定义，您可以创建一个 Pod。然后，Marathon 将一个或 Pod 实例作为 Mesos 任务来调度，具体取决于指定了多少定义。

- Pod 实例可能包括共享某些资源的一个或多个任务（例如，IP、端口、卷）。
- Pod 需要使用 [Mesos 通用容器运行时](#mesos-containerizer-universal-container-runtime)。

## <a name="marathon-group"></a>组

Marathon 组是分层目录 [路径](https://en.wikipedia.org/wiki/Path_%28computing%29) 结构中的一组服务（应用程序和/或 Pod），用于命名空间和组织。
