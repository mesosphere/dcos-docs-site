---
layout: layout.pug
navigationTitle:  系统要求
title: 系统要求
menuWeight: 5
enterprise: false
excerpt: DC/OS 部署的软硬件要求
model: /mesosphere/dcos/2.0/data.yml
render: mustache  
---
DC/OS 群集由 **管理节点** 和 **代理节点** 这两种节点组成。代理节点可以是 **公共代理节点** 或 **专用代理节点**。公共代理节点通过负载均衡器为群集中的服务提供北南（外部向内部）的访问。专用代理主机托管集群上部署的容器和服务。除管理和代理群集节点以外，每个 DC/OS 安装还包括一个用于 DC/OS 安装和升级文件的独立 ** bootstrap 节点**。一些硬件和软件要求适用于所有节点。其他要求特定于要部署的节点类型。

# 硬件前提条件

硬件前提条件是单个 bootstrap 节点、Mesos 管理节点和 Mesos 代理节点。

## bootstrap 节点

* DC/OS 装置在一个 **bootstrap 节点** 上运行，该节点带有两个核心、16 GB RAM 和 60 GB HDD。
* bootstrap 节点仅在安装和升级过程中使用，因此没有针对高性能存储或分离挂载点的具体建议。

<p class="message--note"><strong>注意：</strong>bootstrap 节点必须与群集节点分开。</p>

<a name="CommonReqs">

## 群集中的所有管理节点和代理节点

在安装期间，DC/OS 群集节点是指定的 Mesos 管理节点和代理节点。支持的操作系统和环境列于 [版本政策页面](/mesosphere/dcos/cn/2.0/version-policy/)。

在群集节点上安装 DC/OS 时，所需文件安装在 `/opt/mesosphere` 目录中。您可以安装 DC/OS 之前创建 `/opt/mesosphere` 目录，但它必须是空目录或指向空目录的链接。DC/OS 可以通过在挂载卷上创建空目录，在 `/opt/mesosphere` 处创建指向空目录的链接来安装在单独的卷挂载上。

应当验证对群集中所有管理节点和代理节点的以下要求：
- 每个节点都必须拥有对公共 Docker 存储库或内部 Docker 注册表的网络访问权限。
- 如果节点操作系统为 RHEL 7 或 CentOS 7，则必须停止并禁用`firewalld`守护程序。如需更多信息，请参见 [禁用 RedHat 或 CentOS 上的防火墙守护程序](#FirewallDaemon)。
- 必须停止并禁用 DNSmasq 进程，DC/OS 才能访问端口 53。如需更多信息，请参见 [停止 DNSmasq 进程](#StopDNSmasq)。
- 您未使用 `noexec` 将 `/tmp` 目录安装在您打算使用 DC/OS CLI 的任何系统上。
- 您有足够的磁盘将群集的信息存储在 `var/lib/mesos` 目录中。
- 您不应远程挂载 `/var/lib/mesos` 或 Docker 存储 `/var/lib/docker` 目录。

<a name="FirewallDaemon">

### 禁用 Red Hat 或 CentOS 上的防火墙守护程序
这是一个已知的 <a href="https://github.com/docker/docker/issues/16137" target="_blank">Docker 问题</a>，`firewalld` 进程与 Docker 的交互不佳。有关此问题的更多信息，请参阅 <a href="https://docs.docker.com/v1.6/installation/centos/#firewalld" target="_blank">Docker CentOS firewalld</a> 文档。

要停止并禁用 `firewalld`，请运行以下命令：
```bash
sudo systemctl stop firewalld && sudo systemctl disable firewalld
```
<a name="StopDNSmasq">

### 停止 DNSmasq 进程
DC/OS 群集需要访问端口 53。为防止端口冲突，应运行以下命令来停止并禁用 `dnsmasq` 进程：
```bash
sudo systemctl stop dnsmasq && sudo systemctl disable dnsmasq.service
```

## 管理节点要求

下表列出了管理节点的硬件要求：

|             | 最低   | 推荐 |
|-------------|-----------|-------------|
| 节点数       | 1*         | 3 或 5     |
| 处理器 | 4 核 | 4 核 |
| 内存 | 32 GB RAM | 32 GB RAM |
| 硬盘 | 120 GB | 120 GB |
&ast; 对于业务关键部署，需要三个管理节点，而不是一个管理节点。

管理节点上有许多混合工作负载。预计持续可用或被视为业务关键的工作负载只能在具有至少三个管理节点的 DC/OS 群集上运行。有关高可用性要求的更多信息，请参阅 [高可用性文档][0]。

[0]: /mesosphere/dcos/cn/2.0/overview/high-availability/

管理节点上混合工作负载的示例是 Mesos 复制日志和 ZooKeeper。某些情况下，混合工作负载定期需要与 `fsync` 同步，这可以生成许多昂贵的随机 I/O。我们建议如下：

- 使用固态硬盘 (SSD) 或非易失性快速存储器 (NVMe) 设备进行快速、本地连接的存储。为降低 I/O 延迟问题的可能性，固态硬盘应当尽可能本地连接到物理机。您还应确保将固态硬盘 (SSD) 或非易失性快速存储器 (NVMe) 设备用于托管管理节点重复日志的文件系统。

  在规划存储要求时，请记住，应避免使用单个存储区域网络 (SAN) 设备和 NFS 来连接群集中的节点。这种类型的架构引入延迟的可能性比使用本地存储的可能性要高，还会在原本应该是分布式系统的系统中引入单一故障点。网络延迟和带宽问题可能导致客户端会话超时，并且不利地影响 [DC/OS] 群集性能和可靠性。

- 带备用电池备用单元 (BBU) 的 RAID 控制器。
- 在回写模式下配置的 RAID 控制器缓存。
- 如果可以分离存储挂载点，则建议在管理节点上使用以下存储挂载点。这些建议将通过隔离各种服务的 I/O 来优化繁忙 DC/OS 群集的性能。
  | 目录路径 | 描述 |
  |:-------------- | :---------- |
  | /var/lib/dcos | 管理节点上的大部分 I/O 将出现在此目录结构中。如果计划一个拥有数百个节点的群集或打算以较高速度部署和删除工作负载，则建议将此目录隔离到单独设备上的专用固态硬盘存储。 |

- 对于会发展到数千个节点的群集，建议将此目录结构进一步分解为具体服务的单个挂载点。

  | 目录路径 | 描述 |
  |:-------------- | :---------- |
  | /var/lib/dcos/mesos/master | 日志记录目录 |
  | /var/lib/dcos/cockroach | CockroachDB [enterprise type="inline" size="small" /] |
  | /var/lib/dcos/navstar | 对于 Mnesia 数据库 |
  | /var/lib/dcos/secrets | secrets vault [enterprise type="inline" size="small" /] | 
  | /var/lib/dcos/exec | 各种 DC/OS 服务所需的临时文件。_/var/lib/dcos/exec_ 目录不得在装载有 `noexec` 选项的卷上。 |
  | /var/lib/dcos/exhibitor | Zookeeper 数据库 |
  | /var/lib/dcos/exhibitor/zookeeper/transactions | ZooKeeper 事务日志对磁盘写入延迟非常敏感。如果只能提供有限的固态硬盘空间，则这是要放置的目录。这些日志至少必须要有 2 GB 空间。 |

## 代理节点要求

下表显示了代理节点的硬件要求。

|             | 最低   | 推荐 |
|-------------|-----------|-------------|
| 节点数       | 1         | 6 或更多   |
| 处理器 | 2 核 | 2 核 |
| 内存 | 16 GB RAM | 16 GB RAM |
| 硬盘   | 60 GB     | 60 GB       |

在规划代理节点的内存要求时，应确保代理已配置成可最式程序减少交换空间的使用。建议的最佳实践是优化群集性能并减少潜在资源消耗问题，以尽可能禁用群集中所有代理的内存交换。

除 [群集中所有管理节点和代理节点] 中所述的要求以外(#CommonReqs)，代理节点必须：
- 带 20 GB 或更多可用空间的 `/var` 目录。此目录由沙盒用于 [Docker 和 DC/OS 通用容器运行时](/mesosphere/dcos/cn/2.0/deploying-services/containerizers/)。

-   请勿在您打算使用 DC/OS CLI 的系统上使用 `noexec` 来挂载 `/tmp` 目录，除非 TMPDIR 环境变量设置为 `/tmp/` 以外的其他值。使用 `noexec` 选项来挂载 `/tmp` 可能会破坏 CLI 功能。

- 如果计划一个拥有数百个代理节点的群集或打算以较高速度部署和删除服务，则建议将此目录隔离到专用固态硬盘存储。

    | 目录路径 | 描述 |
    |:-------------- | :---------- |
    | /var/lib/mesos/ | 代理节点的大多数 I/O 将定向到此目录。此外，Apache Mesos 在广告中声明的其 UI 的磁盘空间是支持 _/var/lib/mesos_ |的文件系统广告中声明的空间之和

- 对于会发展到数千个节点的群集，建议将此目录结构进一步分解为具体服务的单个挂载点。

   | 目录路径 | 描述 |
   |:-------------- |:----------- |
   | /var/lib/mesos/slave/slaves | 任务的沙盒目录 |
   | /var/lib/mesos/slave/volumes | 由消耗 ROOT 持久卷的框架使用 |
   | /var/lib/mesos/docker/store | 存储用来配置 URC 容器的 Docker 镜像层 |
   | /var/lib/docker | 存储用来配置 Docker 容器的 Docker 镜像层 |

## <a name="port-and-protocol"></a>端口和协议配置

- 必须在所有节点上启用安全外壳 (SSH)。
- 必须在所有节点上启用互联网控制消息协议 (ICMP)。
-   所有主机名（FQDN 和简短主机名）在 DNS 中必须可解析；正向和反向查找必须成功。 [enterprise type="inline" size="small" /]
- 所有 DC/OS 节点主机名均应解析为**本地可绑定** IP 地址。大多数应用程序都必需通过绑定到本地 IP 地址来解析主机名才能正常运行。无法通过绑定到本地 IP 地址来解析节点主机名的应用程序可能无法以非常规方式运行或行事。 [enterprise type="inline" size="small" /]
- 每个节点均可从 bootstrap 节点访问网络。
- 每个节点均具有从本身到 DC/OS 群集中所有节点的不受限制 IP 至 IP 连接。
-   所有端口都应打开，以进行从管理节点到代理节点的通信，反之亦然。 [enterprise type="inline" size="small" /]
- UDP 必须打开才能进入管理节点上的端口 53。为连接到群集，Mesos 代理节点服务 (`dcos-mesos-slave`) 使用此端口查找 `leader.mesos`。

DC/OS 用户与管理节点之间的中介（例如，执行 SSL 终止的反向代理）要求：

- 在向客户端发送任何数据之前，中介不必缓冲整个回复。
- 检测到客户端消失时，中介还应该关闭相应的上游 TCP 连接（即，中介
不应重复使用上游 HTTP 连接）。

## 高速互联网访问

建议为 DC/OS 安装使用高速互联网连接。DC/OS 服务需要每秒至少 10 MBit。如果工件下载时间超过文件 `/opt/mesosphere/etc/mesos-slave-common` 中 MESOS_EXECUTOR_REGISTRATION_TIMEOUT 的值，某些 DC/OS 服务的安装将失败。MESOS_EXECUTOR_REGISTRATION_TIMEOUT 的默认值为 10 分钟。

# 软件前提条件

* 请参阅 [install_preeqs.sh](https://raw.githubusercontent.com/dcos/dcos/1.10/cloud_images/centos7/install_prereqs.sh) 脚本，了解如何在 CentOS 7 主机上安装 DC/OS 管理节点和代理节点的软件要求的示例。[enterprise type="inline" size="small" /]

* 在 XFS 使用 OverlayFS 时，应使用 -n ftype=1 标记创建 XFS 卷。请参阅 [Red Hat](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/7.2_release_notes/technology-preview-file_systems) 以及 [mesos](http://mesos.apache.org/documentation/latest/container-image/#provisioner-backends) 文档，以了解更多详情。

## Docker 要求

Docker 必须安装在所有 bootstrap 和群集节点上。支持的 Docker 版本列于 [版本策略页面](/mesosphere/dcos/version-policy/)。

### 建议

- 不要在 `devicemapper` 模式下使用 Docker `loop-lvm` 存储驱动。如需更多信息，请参阅 [Docker 和 Device Mapper 存储驱动](https://docs.docker.com/engine/userguide/storagedriver/device-mapper-driver/)。

- 在选择生产存储驱动时，最好是 `OverlayFS` 模式下的 `devicemapper` 或 `direct-lvm`。如需更多信息，请参阅 Docker 的 <a href="https://docs.docker.com/engine/userguide/storagedriver/selectadriver/" target="_blank">选择存储驱动</a>。

- 使用 `systemd` 管理 CentOS 上的 Docker。`systemd` 将启动 Docker 并在它崩溃时帮助重启 Dcoker。

- 以根用户（带 `sudo`）或 <a href="https://docs.docker.com/engine/installation/linux/centos/#create-a-docker-group" target="_blank">docker 用户组</a>中用户的身份，运行 Docker 命令。

### 分配特定的安装

每个 Linux 系统分发都需要以特定方式安装 Docker：

- **CentOS/RHEL** - [从 Docker 的 Yum 存储库安装 Docker][1]。
- **CoreOS** - 提供时 Docker 已预先安装和配置。

如需更多信息，请参阅 Docker 的<a href="https://docs.docker.com/install/" target="_blank">分发特定的安装说明</a>。

## 禁用 sudo 密码提示

要禁用 `sudo` 密码提示，必须将以下行添加到 `/etc/sudoers` 文件。

```bash
%wheel ALL=(ALL) NOPASSWD: ALL
```

或者，您也可以作为 `root` 用户执行 SSH。

## 同步群集中所有节点的时间

网络时间协议 (NTP) 必须在群集中的所有节点上启用，以便时钟同步。默认情况下，在 DC/OS 启动期间，如果未启用，将会出现错误。您可以通过运行以下一个命令来检查 NTP 是否启用，具体取决于操作系统和配置：

```bash
ntptime
adjtimex -p
timedatectl
```

## bootstrap 节点

在安装 DC/OS 之前，您**必须**确保 bootstrap 节点具备以下前提条件。

<p class="message--important"><strong>重要信息：</strong>如果您指定 `exhibitor_storage_backend: zookeeper`，bootstrap 节点将是群集的永久部分。有了 `exhibitor_storage_backend: zookeeper`，Mesos 管理节点的领导者状态和领导者选举将在 bootstrap 节点上的 Exhibitor ZooKeeper 中维持。如需更多信息，请参阅<a href="/mesosphere/dcos/cn/2.0/installing/production/advanced-configuration/configuration-reference/">配置参数文档</a>。</p>


- bootstrap 节点必须与群集节点分开。

### <a name="setup-file"></a>DC/OS 配置文件

- 下载 [dcos_generate_config 文件](https://support.mesosphere.com/hc/en-us/articles/213198586-Mesosphere-Enterprise-DC-OS-Downloads) 并将其保存到 bootstrap 节点。此文件用于创建自定义的 DC/OS 构建文件。请联系销售代表或 <a href="mailto:sales@mesosphere.com">sales@mesosphere.com</a> 以访问此文件。 [enterprise type="inline" size="small" /]

- 下载 [dcos_generate_config 文件](https://downloads.dcos.io/dcos/stable/dcos_generate_config.sh) 并将其保存到 bootstrap 节点。此文件用于创建自定义的 DC/OS 构建文件。 [oss type="inline" size="small" /]

### Docker NGINX（生产安装）

仅用于生产安装，使用此命令安装 Docker NGINX 镜像：

```bash
sudo docker pull nginx
```

## 群集节点

仅对于生产安装，群集节点必须具备以下前提条件。在安装期间，群集节点被指定为 Mesos 管理节点和代理节点。

### 数据压缩（生产安装）

您必须在群集节点上安装 <a href="http://www.info-zip.org/UnZip.html" target="_blank">UnZip</a>、<a href="https://www.gnu.org/software/tar/" target="_blank">GNU tar</a> 和 <a href="http://tukaani.org/xz/" target="_blank">XZ Utils</a> 数据压缩实用程序。

在 CentOS7 和 RHEL7 上安装此类实用程序：

```bash
sudo yum install -y tar xz unzip curl ipset
```

### 群集权限（生产安装）

在每个群集节点上，遵循以下说明：

* 确保 SELinux 属于受支持的模式之一。

    要检查当前 SELinux 状态和配置，请运行以下命令：

    ```bash
    sudo sestatus
    ```

    DC/OS 支持以下 SELinux 配置：

    * 当前模式： `disabled`
    * 当前模式： `permissive`
    * 当前模式： `enforcing`，鉴于 `Loaded policy name` 是 `targeted`
      此模式在 CoreOS 上不受支持。

    要将模式从 `enforcing` 更改为 `permissive`，请运行以下命令：

    ```bash
    sudo sed -i 's/SELINUX=enforcing/SELINUX=permissive/g' /etc/selinux/config
    ```

    或者，如果 `sestatus` 显示“当前模式”为 `enforcing`，但 `Loaded policy name` 不是 `targeted`，请运行以下命令，将 `Loaded policy name` 更改为 `targeted`：

    ```bash
    sudo sed -i 's/SELINUXTYPE=.*/SELINUXTYPE=targeted/g' /etc/selinux/config
    ```

    <p class="message--note"><strong>注意：</strong>确保每个节点上运行的所有服务都能在所选的 SELinux 配置中运行。</p>

* 添加 `nogroup` 和 `docker` 组：

    ```bash
    sudo groupadd nogroup &&
    sudo groupadd docker
    ```

* 重新启动群集，以使更改生效。

    ```bash
    sudo reboot
    ```

    <p class="message--note"><strong>注意：</strong>重启后，节点可能需要几分钟时间才能恢复联机。</p>

### 区域设置要求
您必须将 `LC_ALL` 和 `LANG` 环境变量设置为 `en_US.utf-8`。

- 有关如何在 Red Hat 中设置这些变量的信息，请参阅 [如何在 RHEL 上更改系统区域设置](https://access.redhat.com/solutions/974273)

- 在 Linux 系统上：
````
localectl set-locale LANG=en_US.utf8
````

- 有关如何在 CentOS7 中设置这些变量的信息，请参阅 [如何在 CentOS7 上设定系统区域设置](https://www.rosehosting.com/blog/how-to-set-up-system-locale-on-centos-7/)。

# 后续步骤
- [从 Docker 的 Yum 存储库安装 Docker][1]
- [DC/OS 安装指南][2]

[1]: /mesosphere/dcos/cn/2.0/installing/production/system-requirements/docker-centos/

[2]: /mesosphere/dcos/cn/2.0/installing/production/deploying-dcos/installation/
