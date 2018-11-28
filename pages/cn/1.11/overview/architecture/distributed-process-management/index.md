---
layout: layout.pug
navigationTitle: 分布式进程管理
title: 分布式进程管理
menuWeight: 5
excerpt: 了解 DC/OS 集群中的分布式进程管理
enterprise: false
---


本节介绍 DC/OS 集群中的进程管理，从资源的分配到进程的执行。在高层面上，启动一个进程时，DC/OS 组件之间会发生这种相互作用。通信发生在不同层之间（例如，与调度程序交互的用户）以及层内（例如，与代节点通信的主节点）。

![DC/OS 中分布式进程管理的概念](/cn/1.11/img/dcos-architecture-distributed-process-management-concept.png)

图 1. DC/OS 中的分布式进程管理

以下是使用 Marathon 服务和用户根据 Docker 镜像启动容器的示例：

![DC/OS 中分布式进程管理的示例](/cn/1.11/img/dcos-architecture-distributed-process-management-example.png)

图 2. DC/OS 中使用 Marathon 和 Docker 的分布式进程管理

上述组件之间按时间顺序的相互作用与此相似。请注意，执行器和任务被折叠到一个区块，因为在实践中，情况往往如此：

![DC/OS 中分布式进程管理的序列图](/cn/1.11/img/dcos-architecture-distributed-process-management-seq-diagram.png)

图 3. DC/OS 中分布式进程管理的序列

详细来说，这些步骤如下：

1. 客户端/调度器初始化。在此步骤，客户端需要了解如何连接到调度器以启动一个进程，例如通过 Mesos-DNS 或 DC/OS CLI。
1. Mesos 管理节点将资源邀约发送给调度器，资源邀约基于通过 Mesos 管理节点中的代理和 <a href="https://www.cs.berkeley.edu/~alig/papers/drf.pdf">DRF</a> 算法来进行集群资源管理。
1. 调度器拒绝资源邀约的话是因为客户端没有待处理的进程请求。只要没有客户端还有发起进程，调度器就会拒绝来自管理节点的邀约。
1. 客户发起进程启动。例如，这可以是用户通过 DC/OS [服务] (/1.11/gui/)标签页或通过 HTTP 端点来创建 Marathon 应用程序`/v2/app`。
1. Mesos 管理节点发送资源邀约。例如， `cpus(*):1; mem(*):128; ports(*):[21452-21452]`。
1. 如果资源邀约符合调度器对进程的要求，它将接受邀约并向 Mesos 管理节点发送 `launchTask` 请求。
1. Mesos 管理节点指示 Mesos 代理节点启动任务。
1. Mesos 代理节点通过执行器启动任务。
1. 执行器向 Mesos 代理节点报告任务状态。
1. Mesos 代理节点向 Mesos 管理节点报告任务状态。
1. Mesos 管理节点向调度器报告任务状态。
1. 调度器向客户端报告进程状态。


[auth]：/1.11/security/
[组件]：/1.11/overview/architecture/components/
