---
layout: layout.pug
excerpt: 使用 Azure 资源管理器模板安装 DC/OS 集群
title: 在 Azure 上运行 DC/OS
navigationTitle: Azure
menuWeight: 10
oss: true
---

本页面说明如何使用 Azure 资源管理器模板安装 DC/OS 1.11。

**注意：** 要获得 Azure 市场相关问题的支持，请加入 Azure 市场 [Slack 社区](http://join.marketplace.azure.com)。

- 这种安装方法不支持升级。

- 下列安装方法尚未正式获得 Mesosphere 支持，但由 DC/OS 社区支持。联系 [邮寄列表](https://groups.google.com/a/dcos.io/forum/#!forum/users) 或 [Slack 渠道](http://chat.dcos.io/?_ga=2.226911897.58407594.1533244861-1110201164.1520633201)，获取社区支持。

# 系统要求

## 硬件

要使用 DC/OS 中提供的所有服务，您应该使用 `Standard_D2`[虚拟机](https://azure.microsoft.com/en-us/pricing/details/virtual-machines/) 选择至少五个 Mesos 代理节点，这是 DC/OS Azure 市场提供的默认大小。建议不要选择较小的 VM，而选择较少的 VM 可能会导致某些资源密集型服务（如分布式数据存储）无法正常工作（从安装问题到操作限制）。

### 生产就绪集群配置 ###

这些建议的依据是多年来多个 DC/OS 集群的运行，以及在实时生产负载下扩展有状态和无状态服务的组合等经验。您的服务组合可能执行方式不同，但本文讨论的原则和经验仍然适用。

#### 通用机器配置 ####
我们建议在 VM 上禁用交换。Azure Linux 图像通常默认启用交换。我们发现使用临时固态硬盘交换（通过 WAAgent 配置）
可能会造成与 `D` 系列 VM 的磁盘缓存配置发生冲突。其他 VM 系列（如 `L` 系列）可以使用 SSD 进行交换和其他用途。有关磁盘配置的详细信息，请参阅以下部分。

应使用监控（例如具有 Prometheus 的 Node Exporter）
识别和警告工作负载接近新建 Azure 定义的限制范围的情况。

#### 网络 ####
Azure 上的原始网络性能大致由 VM 大小决定。
`Standard_D8_v3` 等具有 8 个或更多芯核的 VM，可以用于
[Azure 加速网络 (SR-IOV)](https://docs.microsoft.com/en-us/azure/virtual-network/create-vm-accelerated-networking-cli)。
我们发现，与依靠 Azure hypervisor vswitches 相比，使用 SR-IOV 能够显著降低延迟
且使带宽更加充裕稳定。
例如，在我们的测试中，不带 SR-IOV 的`Standard_D16s_v3`
可以在两个 VM 之间推送大约 450MB/s 的数据，而
相同大小的机器在使用 SR-IOV 后，可推送接近 1000MB/s 的数据。
因此，应当尽可能采用 SR-IOV，并且应当确定
实例大小的基准（例如，使用 [iperf3](https://github.com/esnet/iperf)），以确保满足网络
要求。

此外，尽管支持在每台虚拟机配置多个 NIC，
但是带宽的大小是按照 VM 分配的，而非按照 NIC 分配。因此，尽管将
您的网络划分到控制和数据板块（或其他网络）
可能对组织或安全目的有用，但必须进行 Linux 级流量管理，
才能实现带宽控制。

#### 磁盘配置 ####
为了在 Azure 上实现可靠的高性能集群操作，
推荐在特定磁盘配置中使用优质固态硬盘。
托管磁盘 (MD) 比起非托管磁盘 (UMD)，
更能避免存储帐户的限制。
Azure fabric 将适当地管理托管磁盘，以满足
SLA 保证条件。
UMD 的存储帐户限制已记录在
[此处](https://docs.microsoft.com/en-us/azure/storage/common/storage-performance-checklist)。

Azure 中的优质固态硬盘具有的潜在同步 IOP 数量有限，
受到底层磁盘结构延迟的限制。
Etcd、 Zookeeper 和使用
预写式日志 (WAL) 的数据库等服务对这种 I/O 配置特别敏感。
因此，本文所述的很多系统工程都关注
尽量减少和/或消除 Azure 磁盘上的 I/O 争用。

另外，超过机器上的 I/O 分配将导致
限流。建议用户详细学习 [本文章](https://blogs.technet.microsoft.com/xiangwu/2017/05/14/azure-vm-storage-performance-and-throttling-demystify/)，
理解
本文所提供建议的理论背景。

鉴于需要分开同步和异步 I/O 负载
以保持性能，推荐采用以下磁盘安装
配置：
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

完全有可能可以运行具有较小和/或较少磁盘的集群，
但用于生产时，经验证明上述配置具有显著优势，
适用于任何较大的大小的集群。另外，我们建议使用 Mesos MOUNT 磁盘资源将合适的
优质固态硬盘附加到 `/dcos/volume0 ... /dcos/volumeN`
然后即可专门用于数据
密集型服务，不会发生 I/O 争用。

对于 Postgres 或 mysql 等数据密集型服务，应考虑
将 LVM RAID 条带附加到 MOUNT 资源，增加
每秒数据库的交易处理。

关于配置磁盘缓存，请遵守以下一般规则：
- 操作系统磁盘应设置为 `ReadWrite`。
- 具有混合或读取重负载（数据库大宗存储等）的数据磁盘应该
设置为 `ReadOnly`。
- 具有高顺序写入负载的数据磁盘（WAL 磁盘）应设置为 `None`。

## 软件

需要一个活跃的 [Azure 订阅](https://azure.microsoft.com/en-us/pricing/purchase-options/) 以通过 Azure 市场安装 DC/OS。

另外，如需在 DC/OS 集群中访问节点，则要安装和配置 `ssh`。

# 安装 DC/OS

## 部署模板

要在 Azure 上安装 DC/OS 1.11，请使用提供的 [Azure 资源管理器模板](https://downloads.dcos.io/dcos/stable/azure.html)。

关于模板配置的一些说明：

- 选择 `East US` 作为位置，因为模板的某些资源可能无法在其他位置提供。
- 若要通过 OAuth 登录 DC/OS 仪表板，则将 `Oauth Enabled` 设为真。
- 填写 `Agent Endpoint DNS Name Prefix` 和 `Master Endpoint DNS Name Prefix`。
- 输入您的 `SSH RSA Public Key`。

## 访问 DC/OS

1. 在部署的输出中查找 `MASTERFQDN`。要查找该值，单击 `Last deployment` 下面的链接（就是这里的 `4/15/2016 (Succeeded)`），您将看到：

![Deployment history](/cn/1.11/img/dcos-azure-marketplace-step2a.png)

图 1. 部署历史记录

2. 单击最新部署并复制 `MASTERFQDN` 到 `Outputs` 部分。

![Deployment output](/cn/1.11/img/dcos-azure-marketplace-step2b.png)

图 2. 输出部分

3. 记下您在图 2 `Outputs` 部分找到的 `MASTERFQDN` 值，并在以下步骤中使用。出于安全考虑，您无法默认直接访问 Azure 中的 DC/OS 仪表板。

4. 选择以下一种解决方案，访问 Azure 中的 DC/OS 仪表板：

### 案例 1：

要访问 DC/OS 仪表板，您需要访问管理节点的 TCP 端口 80 或 443。可以添加入站安全规则和入站 NAT 规则。

1. 查找管理节点的网络安全组资源，

![Resource - Master Node Network Security Group](/cn/1.11/img/dcos-azure-step2case1a.png)

图 3. 管理节点网络安全组

2. 单击左侧的 **入站安全规则** 选项卡。

![Inbound Security Rules](/cn/1.11/img/dcos-azure-step2case1b.png)

图 4. 入站安全规则

3. 添加入站安全规则。

![Add Inbound Security Rules](/cn/1.11/img/dcos-azure-step2case1c.png)

图 5. 添加入站安全规则 

4. 查找管理节点的负载均衡器资源。

![Resource - Master Node Load balancer](/cn/1.11/img/dcos-azure-step2case1d.png)

图 6. 管理节点负载均衡器

5. 单击左侧的 **入站 NAT 规则** 选项卡，

![Inbound NAT Rules](/cn/1.11/img/dcos-azure-step2case1e.png)

图 7. 入站 NAT 规则

6. 添加入站 NAT 规则。

![Add Inbound NAT Rules](/cn/1.11/img/dcos-azure-step2case1f.png)

图 8. 添加入站 NAT 规则

 现在您可以访问 `http://$MASTERFQDN` 并查看 DC/OS 仪表板。

### 案例 2：使用 ssh 隧道

此时需要设置 SSH 隧道，将 Azure 集群上管理节点的 TCP 端口 80 转发到本地机器的 8000 端口。

复制您在上一步中找到的 `MASTERFQDN` 值并粘贴到以下命令中：

```bash
ssh azureuser@$MASTERFQDN -L 8000:localhost:80
```

例如：

```bash
ssh azureuser@dcosmaster.westus.cloudapp.azure.com -L 8000:localhost:80
```

现在您可以在本地机器上访问 `http://localhost:8000` 并查看 DC/OS 仪表板。

![DC/OS dashboard](/cn/1.11/img/dcos-gui.png)

图 9. DC/OS 仪表板

### 注意事项

有关 SSH 访问的一些注意事项：

- 要连接至 `http://localhost:8000` 进行操作，SSH 命令必须在本地机器上运行，而不是在虚拟机内运行。
- 在上述示例中，假设端口 `8000` 在本地机器上可用。
- 所显示的 SSH 命令仅可在 Mac 或 Linux 上运行。对于 Windows，请使用具有类似端口转发配置的 [PuTTY](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html)。另请参阅 [如何在 Azure 上通过 Windows 使用 SSH](https://azure.microsoft.com/en-us/documentation/articles/virtual-machines-linux-ssh-from-windows/)。
- 如需了解有关 SSH 密钥生成的更多信息，请参阅 [GitHub 教程](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/)。

通过 SSH 隧道连接时，DC/OS UI 不会显示正确的 IP 地址或 CLI 安装命令。

## 运行 DC/OS CLI

以下命令可用于直接在管理节点上运行 DC/OS CLI。

```bash
# Connect to master node with ssh
ssh azureuser@$MASTERFQDN

# Install CLI on the master node and configure with http://localhost
curl https://downloads.dcos.io/binaries/cli/linux/x86-64/dcos-1.11/dcos -o dcos &&
sudo mv dcos /usr/local/bin &&
sudo chmod +x /usr/local/bin/dcos &&
dcos cluster setup http://localhost &&
dcos

# Now you can use the DC/OS CLI:
dcos package search
```

## 卸下 DC/OS 集群

如果在部署步骤中创建了新的资源组，就很容易卸下集群并释放所有资源：只需删除资源组即可。如果已将集群部署到现有资源组，您需要找到属于 DC/OS 集群的所有资源，并手动删除它们。

## 后续步骤

- [添加用户到集群][1]
- [安装 DC/OS 命令行界面 (CLI)][2]
- [扩展注意事项][4]

[1]: /1.11/security/ent/users-groups/
[2]: /1.11/cli/install/
[4]: https://azure.microsoft.com/en-us/documentation/articles/best-practices-auto-scaling/
