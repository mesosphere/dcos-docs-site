---
layout: layout.pug
navigationTitle: Docker 应用和部署缓慢
title: Docker 应用和部署缓慢
menuWeight: 40
excerpt: 解决 Docker 应用和部署缓慢问题

enterprise: false
---

<p class="message--note"><strong>注意：</strong>如果您最近升级到 DC/OS 1.10 或更高版本且在 Mesos 代理节点配置中配置了 <code>MESOS_CGROUPS_ENABLE_CFS=true</code>，则可能会发现 Docker 应用运行缓慢或部署缓慢。</p>

# 严格的 CPU 限制现在已成默认设置

DC/OS 的 Apache Mesos 内核让您可以使用完全公平调度器严格的 CPU 限制（CFS CPU）或 CPU 份额。默认情况下，从版本 1.10 开始在 DC/OS 中使用严格的 CPU 限制，以便在高密度用例中实现更好的性能。但是在某些用例中，希望能够为优先级较高的应用程序提供可用的 CPU 周期。使用 CPU 份额，DC/OS 可以配置为允许 Marathon 应用程序比原始应用定义消耗更多的 CPU 周期。

您的服务或部署可能会运行缓慢，因为它们需要比配置值消耗更多的 CPU 周期。

# 拟采取的步骤

## 提高 CPU 分配

如果 DC/OS  1.10 或更新版本 Docker 服务或部署运行缓慢，可增加服务定义中所需的 CPU 数量。[从 CLI](/cn/1.12/deploying-services/update-user-service/) 或 DC/OS GUI 的 [服务](/cn/1.12/gui/services/)选项卡，将服务定义的 `cpus` 属性变为一个更大的值，并测试提高 CPU 分配后是否解决了问题。

## 使用 DC/OS Pod 增强资源

容器化应用程序通常具有资源密集型启动阶段。传统上，具有高启动要求的任务仅在其生命周期的持续时间内被分配额外资源，一旦不再需要这些资源，则会付出降低群集利用率的代价。通过利用 DC/OS Pod 的资源会计策略，可以创建一个“空”启动容器/任务来请求额外资源并使它们可用于实际需要它们的任务，然后在合理时间段过后完成并放弃这些资源。有关更多信息和示例 pod 定义，请参阅此 [资源提升博客文章](https://mesosphere.com/blog/application-jvm-startup/)。

## 更改 Mesos 代理节点配置

在特殊情况下，您可能想要更改 Mesos 代理节点的配置，以不使用严格的 CFS CPU 限制。如果大部分应用程序在启动期间有 CPU 峰值，但之后消耗较低，或者您有其他高级 CPU 负载，则考虑这一点。只有在不需要严格的 CPU 分离时，才能更改默认行为。

您需要通过更改 Mesos 代理节点配置来更改 DC/OS（或 Mesos）装置的配置。如果您正在考虑更改此配置，请参阅 [Mesos 超额订阅](http://mesos.apache.org/documentation/latest/oversubscription/) 文档，以了解其他注意事项和配置选项。

### 配置代理以使用 CPU 份额

1. 创建或修改每个代理节点上的文件 `/var/lib/dcos/mesos-slave-common`。

1. 添加或设置行 `MESOS_CGROUPS_ENABLE_CFS=false`。

1. 使用 `sudo systemctl restart dcos-mesos-slave` 重新启动 Mesos 代理节点进程。如果此操作已在安装 Mesos 代理节点之前完成，它将自动拾取配置。

1. 重新启动所有 Mesos 代理节点后，重新开始所有任务。重新启动代理节点不会导致任务重新开始，但也不会拾取新设置，因此必须重新启动。

