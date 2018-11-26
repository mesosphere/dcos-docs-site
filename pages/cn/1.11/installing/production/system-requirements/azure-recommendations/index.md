---
layout: layout.pug
title: Azure 建议
navigationTitle: Azure 
menuWeight: 25
excerpt: 针对 Azure 的建议
---

# 生产就绪集群配置

这些建议的依据是多年来多个 DC/OS 集群的运行，以及在实时生产负载下扩展有状态和无状态服务的组合等经验。您的服务组合可能执行方式不同，但本文讨论的原则和经验仍然适用。

## 通用机器配置 
我们建议在 VM 上禁用交换，这通常是 Azure Linux 图像的默认设置。我们发现，使用临时固态硬盘进行交换（通过 WAAgent 配置）可能会与 `D` 系列 VM 的磁盘缓存配置发生冲突。其他 VM 系列（如 L 系列）可以使用固态硬盘进行交换和其他用途。

有关磁盘配置的详细信息，请参阅以下部分。应使用监控（例如，带有 Prometheus 的 Node Exporter）识别和警告工作负载接近 Azure 定义的限制范围。

## 网络 
Azure 上的原始网络性能大致由 VM 大小决定。具有 8 个或更多内核的 VM（如 `Standard_D8_v3`）可用于 [Azure 加速网络 (SR-IOV)](https://docs.microsoft.com/en-us/azure/virtual-network/create-vm-accelerated-networking-cli)。使用 SR-IOV，而不是依靠 Azure 虚拟机管理程序 vswitch，延迟更低、可用性更高且带宽更稳定。例如，在我们的测试中，不使用 SR-IOV 的 `Standard_D16s_v3` 可以在两个虚拟机之间推送大约 450MB/s 的数据，而相同大小的机器在使用 SR-IOV 后，可推送将近 1000MB/s 的数据。因此，应尽可能部署 SR-IOV，并且应对实例大小进行基准测试（例如，使用 [iperf3]）(https://github.com/esnet/iperf)），确保满足您的网络要求。

另外，虽然每个虚拟机都支持多个 NIC，但是带宽取决于 VM，而不是 NIC。因此，将网络分割为控制和数据板块（或其他网络）可能对组织或安全目的有用，需要 Linux 级流量成形才能实现带宽控制。

## 磁盘配置 
为了在 Azure 上实现高性能的可靠集群操作，建议使用具有特定磁盘配置的优质固态硬盘。托管磁盘 (MD) 比非托管磁盘 (UMD) 更能避免存储帐户限制：Azure fabric 将适当地安置托管磁盘，以满足保证 SLA 要求。UMD 的存储帐户限制已记录在 [此处](https://docs.microsoft.com/en-us/azure/storage/common/storage-performance-checklist)。

在 Azure 上，优质固态硬盘具有有限数量的同步 IOP，可能受底层磁盘结构延迟的限制。etcd，Zookeeper 和使用预写式日志 (WAL) 的数据库等服务对此 I/O 配置特别敏感。因此，本文所述的大部分系统工程都集中探讨如何尽量减少和/或消除 Azure 磁盘上的 I/O 争用。另外，超过机器上的 I/O 分配会导致限流。可在 [揭秘 Azure VM 存储性能和限流](https://blogs.technet.microsoft.com/xiangwu/2017/05/14/azure-vm-storage-performance-and-throttling-demystify/) 上学习本文章。
详细了解本文所提供建议的理论背景。

鉴于需要分离同步和异步 I/O 负载以维持性能，我们推荐以下磁盘安装配置：
- 管理节点：
 - / - P10
 - /var/lib/etcd -（用于在 CorEos 上运行 etcd 的节点） - P10
 - /var/log - P10
 - /var/lib/dcos/exhibitor - P10
- 公共代理：
 - / - P10
 - /var/log - P10
 - /var/lib/docker - P10
 - /var/lib/mesos/slave - P10
- 专用代理：
 - / - P10
 - /var/log - P10
 - /var/lib/docker - P10
 - /var/lib/mesos/slave - P20

很有可能可以运行磁盘较小和/或更少的集群，但在生产中的使用证明，上述配置对于非小型集群具有很大优势。此外，我们建议使用 Mesos MOUNT 磁盘资源，将适当的高级固态硬盘安装到 `/dcos/volume0 ... /dcos/volumeN` ，可在之后专门用于数据密集型服务，而不会导致 I/O 争用。对于 postgres 或 mysql 等数据密集型服务，应考虑将 LVM RAID 条带连接到这些 MOUNT 资源，以增加每秒数据库的可能处理量。

关于配置磁盘缓存，请遵守以下一般规则：
- 操作系统磁盘应设置为 `ReadWrite`。
- 具有混合或读取重负载（数据库大宗存储等）的数据磁盘应设置为 `ReadOnly`。
- 具有高顺序写入负载的数据磁盘（WAL 磁盘）应设置为 `None`。
