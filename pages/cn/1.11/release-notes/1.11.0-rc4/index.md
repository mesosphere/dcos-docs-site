---
layout: layout.pug
navigationTitle: 1.11.0 候选版本 4 的版本注释
title: 1.11.0 RC 4 版本注释
menuWeight: 25
excerpt: DC/OS 1.11.0 候选版本 4 的版本注释
---

这些是 DC/OS 1.11.0 候选版本 4 的版本注释。

<table class="table" bgcolor="#FAFAFA"> <tr> <td style="border-left: thin solid; border-top: thin solid; border-bottom: thin solid;border-right: thin solid;">

[button color="purple" href="https://downloads.dcos.io/dcos/EarlyAccess/1.11.0-rc4/dcos_generate_config.sh"]Download DC/OS Open Source[/button]

要下载 DC/OS Enterprise，请联系：[Mesosphere 服务支持](https://support.mesosphere.com)。

<h3>此候选版本仅用于测试，不在生产中使用。</h3>


DC/OS 1.11 候选版本 4 有许多限制，将在 GA 时解决。
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

## 集成了 Apache Mesos 1.5、Marathon 1.6 和 Kubernetes 1.9。
- DC/OS 1.11.0 基于 Mesos 1.5。查看 [Mesos 更改日志](https://github.com/apache/mesos/blob/1.5.x/CHANGELOG)。

- DC/OS 1.11.0 与最新的 1.6 版 Marathon 集成。有关 Marathon 1.6 的更多信息，请参阅 [Marathon 更改日志](https://github.com/mesosphere/marathon/blob/master/changelog.md)。

- DC/OS 1.11.0 支持最新的 Kubernetes 1.9 容器调度程序。有关 DC/OS 上 Kubernetes 1.0 的更多信息，[查看文档](https://docs.mesosphere.com/services/kubernetes/1.0.0-1.9.3)。

## 平台
- 故障域感知。利用故障域感知使服务高度可用，并能在需要时增加容量。[查看文档](/cn/1.11/deploying-services/fault-domain-awareness/)。[enterprise type="inline" size="small" /]
- 已链接的集群。- 集群链路是一个集群和另一个集群之间的**单向关系**。使用 DC/OS CLI 将一个集群的链接添加到另一个集群或将其删除。设置链接后，您可以使用 CLI 或 UI 轻松在集群之间切换。[查看文档](/cn/1.11/administering-clusters/multiple-clusters/cluster-links/)。[enterprise type="inline" size="small" /]
- 集成远程区域。使“突发”充分利用临时云计算资源。[查看文档](/cn/1.11/deploying-services/fault-domain-awareness/)。[enterprise type="inline" size="small" /]
- [多区域管理](/cn/1.11/deploying-services/fault-domain-awareness/)。使 DC/OS 集群能跨越多个数据中心、云和远程分支，同时提供统一的管理和控制集群。
- 停用节点。支持永久停用节点使得在使用后更容易维护和让“Spot”云实例退役，从而允许立即重新安排任务，而不是延时重新安排任务。
- UCR
 - 支持 Docker 镜像垃圾收集。[查看文档](/cn/1.11/deploying-services/containerizers/)。
 - 支持 Docker 镜像拉取秘钥。

## 网络
[enterprise]
- Edge-LB 1.0 RC 候选版本。[查看文档](https://docs.mesosphere.com/services/edge-lb/1.0/)
[/enterprise]
- Docker 容器现在支持 IPv6 。
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
- DC/OS 1.11 介绍了行业标准容器存储接口 (CSI) 版本 0.1 的实现，它通过在容器编排器 (DC/OS) 和存储设备之间提供通用 API，让开发人员（Mesosphere、社区和合作伙伴）能够提高开发 DC/OS 中存储功能的效率。[查看文档](/cn/services/beta-storage/0.1.0-beta)。[enterprise type="inline" size="small" /]
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
- 支持从 1.10.5 升级到 1.11.0-rc4，但不推荐这样做。
- 在 1.11 候选版本 4 中，不支持从 1.11.0-rc1 升级到 1.11.0-rc4。

# <a name="fixed-issues"></a>自 1.11.0 候选版本 1 以来的改进和修复的重大问题
- COPS-2201 - 修复 `dcos-diagnostics` 在运行 gen_resolvconf.py 后崩溃的问题。
- COPS-2465 - 现在许可证状态在多管理节点环境中保持一致。[enterprise type="inline" size="small" /]
- DCOS-16510 - `dcos-secrets`服务使用的 HashIcorp Vault 版本已从 v0.5.2 更新到 v0.8.3。
- DCOS-19050 - 如果 `dcos-secrets` 使用的 Vault 实例本身密封，服务现在可以自动将其解除密封。
- DCOS-19500 - 修复 Marathon 在部署时出现的 cosmos/服务/更新失败。
- DCOS-20064 - 支持 Azure 和 AWS 模板中的许可证参数。[enterprise type="inline" size="small" /]
- DCOS-20396 - 测试当旧证书不匹配新的 CSR 时 bootstrap 重新生成证书。
- DCOS-20492 - 在使用 AWS CloudFormation 模板时，集群有时会在没有许可证的情况下出现。[enterprise type="inline" size="small" /]
- DCOS-20515 - 使得授权时注意版本而防止升级失败。[enterprise type="inline" size="small" /]
- DCOS-20569 - 仅包括诊断捆绑包上许可证的公共属性。[enterprise type="inline" size="small" /]
- DCOS-20628 - `dcos-vault`：修复 go-zookeeper 库中的死锁。
- DCOS-20676 - `csidevices`：修复空字符串布尔值的 lsblk 解析。
- DCOS-20679 - 在配置升级期间，让许可处理相同主要版本的集群许可证更新。[enterprise type="inline" size="small" /]
- DCOS-20772 - 更新 znode 创建方案，以存储许可证审核数据。
- DCOS-21000 - 发布 Marathon 插件，具有资源完整授权漏洞修复。
- DCOS-21045 - 更新 `dcos-cluster-linker` 使其不允许自我链接。[enterprise type="inline" size="small" /]
- DCOS-21095 - 在 IPv4 环境中关闭 IPv6 覆盖。
- DCOS_OSS-1587 - 支持非 Root LVM 卷上的 DC/OS 安装。
- DCOS_OSS-2070 - 服务不能使用 UCR 网桥模式从本地代理通过 l4lb VIP 访问。
- DCOS_OSS-2105 - UI 可以显示由于事件丢失而导致的过时任务状态（相关 MESOS-8469 - 修复算子 API 流中 Mesos 管理节点丢失事件的问题）。
- METRONOME-100 - 修复Metronome 重启导致作业重复的问题。
- METRONOME-190 - 添加授权的启动队列。
- METRONOME-191 - 执行启动最后期限超时。
- METRONOME-194 - 支持 FORBID 并发政策。
- 将 Marathon 更新到 1.6.322 (https://github.com/dcos/dcos/pull/2473 | https://github.com/mesosphere/dcos-enterprise/pull/2278)
- 将 Mesos 更新到 1.5.x 9840ae1 (https://github.com/dcos/dcos/pull/2472 | https://github.com/mesosphere/dcos-enterprise/pull/2263)

<p class="message--note"><strong>注意: </strong> Kubernetes 包依赖关系记录 <a href="https://docs.mesosphere.com/services/kubernetes/1.2.0-1.10.5/install">在此处</a>。</p>
