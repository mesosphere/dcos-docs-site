---
layout: layout.pug
navigationTitle: 虚拟基础架构
title: 虚拟基础架构
menuWeight: 1
excerpt: 在虚拟化基础架构上运行 DC/OS - 最佳实践

---

以下内容旨在为在虚拟化基础架构上运行 DC/OS 群集的客户提供操作指导。虽然以下指南引用 VMware vSphere 概念，但应将类似设置应用于其他虚拟机管理程序和虚拟化技术。

请联系您的客户成功团队获取更多指导。

# 性能和容量指南

## 建议：

 - 最大程度地减少主机上的 CPU 和其他资源超额订阅
 - 在计划 DC/OS 主节点的主机上保持 CPU 就绪时间* < 5%

<p class="message--note"><strong>注意：</strong>CPU 就绪时间是记录虚拟机准备好使用 CPU 但因为所有 CPU 资源都忙碌而无法安排时间的度量。</p>

# 时间保留指南

DC/OS 群集需要节点之间的强大时间同步，以实现最佳功能。请检查您的 DC/OS 群集上 [NTP 已启用](https://docs.mesosphere.com/1.12/installing/production/system-requirements/#enable-ntp) ，帮助确保此类强大同步。

## 建议：

 - 禁用 VMware 工具时间同步和 [配置 ESXi 主机和客户以使用可靠的 NTP 源](https://blogs.vmware.com/vsphere/2018/07/timekeeping-within-esxi.html)

 - 将以下行添加到虚拟机配置文件中 (.vmx) [以禁用时间同步](https://kb.vmware.com/s/article/1189)：

  ```
  tools.syncTime = "0"
  time.synchronize.continue = "0"
  time.synchronize.restore = "0"
  time.synchronize.resume.disk = "0"
  time.synchronize.shrink = "0"
  time.synchronize.tools.startup = "0"
  time.synchronize.tools.enable = "0"
  time.synchronize.resume.host = "0"
  ```

 ### 可选

 - 考虑使用 `ntpd -x`禁用 NTP 转换模式。
 - 在 NTP 配置中设置 `tinker panic` 为 `0` 。

# vSphere DRS 设置

DRS（[分布式资源调度程序](https://www.vmware.com/products/vsphere/drs-dpm.html)) 是一款 vSphere 功能，可在 vSphere 群集中平衡可用资源的计算工作负载。

对于在其上计划 Zookeeper 和 etcd 组件的主节点和代理节点，建议将 DRS 自动化设置为已禁用或部分自动化。如果启动了多个实时迁移操作，负载下的 vSphere 群集可能导致 Zookeeper 系综或 etcd 群集上的不稳定行为。实时迁移 (vMotion) 可能会发出 [“Stop the World” Pause](https://cormachogan.com/2015/04/28/when-and-why-do-we-stun-a-virtual-machine/) （也称为“STUN”），以便完成到另一个主机的迁移。

另请注意，如果在某些条件下触发了实时迁移，Zookeeper 和 etcd 可能会遇到故障转移事件，并且应该注意不要丢失违反可容忍的故障数量的系综里的多个成员。因此，一个数量为 3 的 Zookeeper 系综可以容忍一台服务器的故障，而为 5 的系综可以容忍两台服务器的故障。

## 建议：

- 将 DRS“自动化级别”设置为“已禁用”或“部分自动”，用于 DC/OS 主节点以及托管 Zookeeper 或 etcd 实例的任何节点。
- 创建虚拟机-虚拟机的反关联规则，以防止在同一主机上计划 DC/OS 主节点。
- 考虑为在 DC/OS 上部署的其他独立 Zookeeper 或 etcd 节点创建反关联规则/策略，以确保主机（虚拟机监视器）故障不会导致服务中断。
- 如果您的虚拟化群集中有可用容量，或者正在运行大型 DC/OS 群集，请考虑为代理节点创建反关联规则/策略。
- 故障域注意事项（如机架、行和数据中心）的因素，以确保虚拟机（和 DC/OS 节点）的弹性资源放置。

### 可选：

- 为 DC/OS 主节点将“vSphere 延迟灵敏度”设置为“高”

# vSphere HA 设置

vSphere HA 群集中的主机受监控，在故障的情况下，在群集中的备用主机上会重新启动故障主机上的虚拟机。

## 建议：

- 较之 DC/OS 代理节点，为 DC/OS 主节点设置更高的重新启动优先级。
