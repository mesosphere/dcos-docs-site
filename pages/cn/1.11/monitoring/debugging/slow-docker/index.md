---
layout: layout.pug
navigationTitle: Docker 应用和部署缓慢
title: Docker 应用和部署缓慢
menuWeight: 40
excerpt: 解决 Docker 应用和部署缓慢问题

enterprise: false
---

如果您最近升级到 DC/OS 1.10 或更高版本且在 Mesos 代理节点配置中配置了 `MESOS_CGROUPS_ENABLE_CFS=true`，则可能会发现 Docker 应用运行缓慢或部署缓慢。

# 严格的 CPU 限制现在已成默认设置

使用 Apache Mesos 时，您可以选择使用 CPU 份额或严格 CPU 限制。使用 CPU 份额时，如果主机系统有自由的 CPU 周期，您的任务可能会消耗多过最初在“Marathon 应用定义”中配置的 CPU 周期数。如果您使用严格的 CPU 限制，则任务只能根据 Marathon 配置消耗最多 CPU 时间。

完全公平调度器 (CFS) 严格的 CPU 限制是 DC/OS 的默认限制，但此配置仅有 Mesos 执行器遵守，而不是 Docker 执行器。最新 Mesos 版本中的修复补丁 [MESOS-6134](https://issues.apache.org/jira/browse/MESOS-6134)（也包含在 DC/OS 1.10 中）消除了这一限制。

您的服务或部署可能会运行缓慢，因为它们需要比配置值消耗更多的 CPU 周期。

# 拟采取的步骤

## 提高 CPU 分配

如果由于 DC/OS 升级或配置 `MESOS_CGROUPS_ENABLE_CFS=true` 而导致 Docker 服务或部署运行缓慢，可增加服务定义中所需的 CPU 数量。[从 CLI](/cn/1.11/deploying-services/update-user-service/) 或 DC/OS GUI 的**服务**选项卡，将服务定义的 `cpus` 属性变为一个更大的值，并测试提高 CPU 分配后是否解决了问题。

## 更改 Mesos 代理节点配置

在特殊情况下，您可能想要更改 Mesos 代理节点的配置，以不使用严格的 CFS CPU 限制。如果大部分应用程序在启动期间有 CPU 峰值，但之后消耗较低，或者您有其他高级 CPU 负载，则考虑这一点。只有在不需要严格的 CPU 分离时，才能更改默认行为。

您需要通过更改 Mesos 代理节点配置来更改 DC/OS（或 Mesos）装置的配置。如果您正在考虑更改此配置，请参阅 [Mesos 超额订阅](http://mesos.apache.org/documentation/latest/oversubscription/) 文档，以了解其他注意事项和配置选项。

### 配置更改

1. 创建或修改每个代理节点上的文件 `/var/lib/dcos/mesos-slave-common`。

1. 添加或设置行 `MESOS_CGROUPS_ENABLE_CFS=false`。

1. 使用 `sudo systemctl restart dcos-mesos-slave` 重新启动 Mesos 代理节点进程。如果此操作已在安装 Mesos 代理节点之前完成，它将自动拾取配置。

1. 重新启动所有 Mesos 代理节点后，重新开始所有任务。重新启动代理节点不会导致任务重新开始，但也不会拾取新设置，因此必须重新启动。

