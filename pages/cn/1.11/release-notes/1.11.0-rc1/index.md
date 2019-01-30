---
layout: layout.pug
navigationTitle: 1.11.0 候选版本 1 的版本注释
title: 1.11.0 RC 1 版本注释
menuWeight: 30
excerpt: DC/OS 1.11.0 候选版本 1 的版本注释
---

这些是 DC/OS 1.11.0 候选版本 1 的版本注释。

<table class="table" bgcolor="#FAFAFA"> <tr> <td style="border-left: thin solid; border-top: thin solid; border-bottom: thin solid; border-right: thin solid;">

[button color="purple" href="https://downloads.dcos.io/dcos/EarlyAccess/1.11.0-rc1/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

要下载 DC/OS Enterprise，请联系：[Mesosphere 服务支持](https://support.mesosphere.com/hc/en-us/articles/213198586)。

<h3>此候选版本仅用于测试，不在生产中使用。</h3>


DC/OS 1.11.0 候选版本 1 有许多限制，将在 GA 时解决。
<ul>
<li>DC/OS 1.11 需要有 CLI 版本 0.6.x。
  <ul>
  <li><a href="/1.11/cli/uninstall/">卸载现有 CLI</a>。</li>
  <li>根据 1.11 DC/OS GUI 左上角处下拉列表中的 <strong>安装 CLI</strong> 说明，安装版本 0.6.x。</li>
  </ul>
<strong>注意：</strong>CLI 版本 0.6.x 与 DC/OS 1.10 不兼容</li>
</ul>
请尝试新功能和更新的数据服务。请通过我们的支持渠道 <a href="https://support.mesosphere.com/">support.mesosphere.com</a> 提供任何反馈。
</td> </tr> </table>

<a name="new-features"></a>
# 新特性和功能

## 集成了 Apache Mesos 1.5, Marathon 1.6 和 Kubernetes 1.9。
- DC/OS 1.11.0 基于 Mesos 1.5。查看 [Mesos 更改日志](https://github.com/apache/mesos/blob/1.5.x/CHANGELOG)。
- DC/OS 1.11.0 与最新的 1.6 版 Marathon 集成。有关 Marathon 1.6 的更多信息，请参阅 [Marathon 更改日志](https://github.com/mesosphere/marathon/blob/master/changelog.md)。
- DC/OS 1.11.0 支持最新的 Kubernetes 1.9 容器调度程序。有关 DC/OS 上 Kubernetes 1.0 的更多信息，[查看文档](https://docs.mesosphere.com/services/kubernetes/1.0.0-1.9.3)。

## 平台
- 故障域感知。利用故障域感知使服务高度可用，并能在需要时增加容量。[查看文档](/cn/1.11/deploying-services/fault-domain-awareness/)。[enterprise type="inline" size="small" /]
- 链接的集群。- 集群链路是一个集群和另一个集群之间的**单向关系**。使用 DC/OS CLI 将一个集群的链接添加到另一个集群或将其删除。设置链接后，您可以使用 CLI 或 UI 轻松在集群之间切换。[查看文档](/cn/1.11/administering-clusters/multiple-clusters/cluster-links/)。[enterprise type="inline" size="small" /]
- 集成远程区域。使“突发”充分利用临时云计算资源。[查看文档](/cn/1.11/deploying-services/fault-domain-awareness/)。[enterprise type="inline" size="small" /]
- [多区域管理](/cn/1.11/deploying-services/fault-domain-awareness/)。使 DC/OS 集群能跨越多个数据中心、云和远程分支，同时提供统一的管理和控制集群。
- 停用节点。支持永久停用节点使得在使用后更容易维护和退役“Spot”云实例，从而允许立即重新安排任务，而不是延时重新安排任务。
- UCR
 - 支持 Docker 镜像垃圾收集。[查看文档](/cn/1.11/deploying-services/containerizers/)。
 - 支持 Docker 镜像拉取秘钥。

## 网络
[enterprise]
- Edge-LB 1.0 RC 候选版本。[查看文档](https://docs.mesosphere.com/services/edge-lb/1.0/)
[/enterprise]
- 现在 Docker 容器支持IPv6。
- DC/OS 网络堆栈的性能改进。所有网络组件 (minuteman、navstar、spartan) 被整合到一个被称为 `dcos-net` 的单个 systemd 单元中。请查看有关 [网络软件重构](/cn/1.11/networking/#a-note-on-software-re-architecture) 的注释，进一步了解网络堆栈的重新分解。


[enterprise]
## 安全
[/enterprise]
- 密钥管理服务
 - 现在支持二进制密钥文件
 - 现在支持分层访问控制。

## 监控
- DC/OS 度量标准组件现在以 [Prometheus](https://prometheus.io/docs/instrumenting/exposition_formats/) 格式产生度量标准。[查看文档](/cn/1.11/metrics/)。
- 收集容器（任务）和系统组件日志的统一日志记录端点。

## 存储
- DC/OS 1.11 介绍了行业标准容器存储接口 (CSI) 版本 0.1 的实现，它通过在容器编排器 (DC/OS) 和存储设备之间提供通用 API，让开发人员（Mesosphere、社区和合作伙伴）能够提高开发 DC/OS 中存储功能的效率。[enterprise type="inline" size="small" /]
- Pod 现在支持永久卷。[查看文档](/cn/1.11/deploying-services/pods/)。

<p class="message--note"><strong>注意: </strong> 因为这些存储特性在 1.11 中为 beta，因此必须明确启用。不建议将 beta 特性用于生产用途，但却是指出项目前进方向的良好指示。</p>

## 更新了 DC/OS 数据服务
- 现在支持对 DC/OS Kafka、DC/OS Cassandra、DC/OS Elastic 和 DC/OS HDFS 的TLS 加密。
- 对 DC/OS Kafka、DC/OS Cassandra、DC/OS Elastic 和 DC/OS HDFS 的故障域感知。利用故障域感知使服务高度可用，并能在需要时增加容量。
- 新的 API 端点用于暂停 DC/OS Kafka、DC/OS Cassandra、DC/OS Elastic 和 DC/OS HDFS 的节点。使用此端点以空闲命令状态重新启动节点用于调试。
- 新的 beta DC/OS Kafka ZooKeeper 服务。[查看文档](/cn/services/beta-kafka-zookeeper/)。
- 现在，您可以从 DC/OS UI 的下拉菜单中选择 DC/OS 数据服务版本。
- 提高了所有 DC/OS 数据服务的可扩展性。

# <a name="known-issues"></a>已知问题和限制
- 在 1.11.0 候选版本 1 中，不支持从 1.10 升级到 1.11。
- DCOS-19047 - 在从 1.10.x 升级到 1.11.0 时，`dcos-secrets` 服务不可用。[enterprise type="inline" size="small" /]


# <a name="fixed-issues"></a>在 1.11.0 候选版本 1 中的改进和修复的重大问题
- DCOS-19573 - 增加对 UI 中独特限制的更改支持。
- DCOS-19837 - 将所有云提供商的故障域脚本整合到一个脚本中，以支持与多个云提供商的集群。
- DCOS-19896 - 添加 `--linked` 标记到 `dcos cluster list`，使用户可以看到哪些集群可以取消链接。[enterprise type="inline" size="small" /]
- DCOS-19955 - 提升 API 和 CLI 的链接集群体验。[enterprise type="inline" size="small" /]
- DCOS_OSS-1658 - 添加 `--verbose` 标记以升级可将所有状态和错误消息打印到控制台的脚本以启用升级调试。
- DCOS_OSS-1733 - 配置参数 `dns_forward_zones` 现在采用对象列表，而不是嵌套列表。
- DCOS_OSS-2130 - `systemd-networkd` 必须启用，DC/OS 网络才能配合 CoreOS 工作。

<p class="message--note"><strong>注意: </strong> Kubernetes 包依赖关系记录 <a href="https://docs.mesosphere.com/services/kubernetes/1.2.0-1.10.5/install">在此处</a>。</p>
