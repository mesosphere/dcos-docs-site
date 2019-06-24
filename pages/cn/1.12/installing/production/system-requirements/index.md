---
layout: layout.pug
navigationTitle: 系统要求
title: 系统要求
menuWeight: 5
enterprise: false
excerpt: DC/OS 部署的软硬件要求

渲染：胡须 
---

# 硬件先决条件

硬件先决条件是单个 bootstrap 节点、Mesos 管理节点和 Mesos 代理节点。

## bootstrap 节点

* DC/OS 装置在一个 Bootstrap 节点上运行，该节点带有两个核心、16 GB RAM 和 60 GB HDD。
* bootstrap 节点仅在安装和升级过程中使用，因此没有针对高性能存储或分离挂载点的具体建议。

<p class="message--note"><strong>注意：</strong>bootstrap 节点必须与群集节点分开。</p>


## 群集节点

在安装期间，群集节点是指定的 Mesos 管理节点和代理节点。支持的操作系统和环境列于 [版本政策页面](https://docs.mesosphere.com/version-policy/)。

DC/OS 安装到群集节点上的 `/opt/mesosphere`。`/opt/mesosphere` 目录可在安装 DC/OS 之前创建，但必须是空目录或指向空目录的链接。DC/OS 可以通过在挂载卷上创建空目录，在 `/opt/mesosphere` 处创建指向空目录的链接，然后安装 DC/OS 的方式，安装在单独的卷挂载上。

## 管理节点

下表显示了管理节点的硬件要求：

| | 最低 | 推荐 |
|-------------|-----------|-------------|
| 节点数 | 1* | 3 或 5 |
| 处理器 | 4 核 | 4 核 |
| 内存 | 32 GB RAM | 32 GB RAM |
| 硬盘 | 120 GB | 120 GB |
&ast; 对于业务关键部署，需要三个管理节点，而不是一个管理节点。

管理节点上有许多混合工作负载。预计持续可用或被视为业务关键的工作负载只能在具有至少三个管理节点的 DC/OS 群集上运行。有关高可用性要求的更多信息，请参阅 [高可用性文档][0]。

[0]: /1.12/overview/high-availability/


管理节点上混合工作负载的示例是 Mesos 复制日志和 ZooKeeper。其中部分每隔一段时间需要进行 fsync()，而且可以生成很多非常昂贵的随机 I/O。我们推荐以下内容：

- 固态硬盘 (SSD)
- 带 BBU 的 RAID 控制器
- 在回写模式下配置的 RAID 控制器缓存
- 如果可以分离存储挂载点，则建议在管理节点上使用以下存储挂载点。这些建议将通过隔离各种服务的 I/O 来优化繁忙 DC/OS 群集的性能。
 | 目录路径 | 描述 |
  |:-------------- | :---------- |
 | _/var/lib/dcos_ | 管理节点上的大部分 I/O 将出现在此目录结构中。如果计划一个拥有数百个节点的群集或打算以较高速度部署和删除工作负载，则建议将此目录隔离到专用固态硬盘存储。

- 对于会发展到数千个节点的群集，建议将此目录结构进一步分解为具体服务的单个挂载点。

 | 目录路径 | 描述 |
  |:-------------- | :---------- |
 | _/var/lib/dcos/mesos/master_ | 日志记录目录 |
 | _/var/lib/dcos/cockroach_ | CockroachDB [enterprise type="inline" size="small" /] |
 | _/var/lib/dcos/navstar_ | 对于 Mnesia 数据库 |
 | _/var/lib/dcos/secrets_ | secrets vault [enterprise type="inline" size="small" /] | 
 | _/var/lib/dcos/exhibitor_ | Zookeeper 数据库 |

### 代理节点

下表显示了代理节点的硬件要求。

| | 最低 | 推荐 |
|-------------|-----------|-------------|
| 节点数 | 1 | 6 或更多 |
| 处理器 | 2 核 | 2 核 |
| 内存 | 16 GB RAM | 16 GB RAM |
| 硬盘 | 60 GB | 60 GB |

代理节点还必须具有：

- 带 20 GB 或更多可用空间的 `/var` 目录。此目录由沙盒同时用于 [Docker 和 DC/OS 通用容器运行时](/1.12/deploying-services/containerizers/)。
- 公共 Docker 存储库或内部 Docker 注册表的网络访问权限。
- 在 RHEL 7 和 CenTos 7 上，必须停止并禁用 `firewalld`。这是一个已知的 <a href="https://github.com/docker/docker/issues/16137" target="_blank">Docker 问题</a>，`firewalld` 与 Docker 的交互不佳。如需更多信息，请参阅 <a href="https://docs.docker.com/v1.6/installation/centos/#firewalld" target="_blank">Docker CentOS firewalld</a> 文档。

    ```bash
    sudo systemctl stop firewalld && sudo systemctl disable firewalld
    ```

- 禁用 DNSmasq（DC/OS 需要访问端口 53）：

    ```bash
    sudo systemctl stop dnsmasq && sudo systemctl disable dnsmasq.service
    ```

- 群集的 Mesos 管理节点和代理节点持久信息存储在 `var/lib/mesos` 目录中。

 <p class="message--important"><strong>重要信息：</strong>不要远程挂载 `/var/lib/mesos` 或 Docker 存储目录（默认情况下 `/var/lib/docker`）。</p>

- 在您打算使用 DC/OS CLI 的系统上挂载 `noexec` 可能破坏 CLI 功能，除非 TMPDIR 环境变量设置为 `/tmp/` 以外的其他值。

- 如果计划一个拥有数百个代理节点的群集或打算以较高速度部署和删除服务，则建议将此目录隔离到专用固态硬盘存储。

 | 目录路径 | 描述 |
    |:-------------- | :---------- |
 | _/var/lib/mesos/_ | 代理节点的大多数 I/O 将定向到此目录。此外，Apache Mesos 在广告中声明的其 UI 的磁盘空间是支持 _/var/lib/mesos_ |的文件系统广告中声明的空间之和

- 对于会发展到数千个节点的群集，建议将此目录结构进一步分解为具体服务的单个挂载点。

 | 目录路径 | 描述 |
   |:-------------- |:----------- |
 | _/var/lib/mesos/slave/slaves_ | 任务的沙盒目录 |
 | _/var/lib/mesos/slave/volumes_ | 由消耗 ROOT 持久卷的框架使用 |
 | _/var/lib/mesos/docker/store_ | 存储用来配置 URC 容器的 Docker 镜像层 |
 | _/var/lib/docker_ | 存储用来配置 Docker 容器的 Docker 镜像层 |

### <a name="port-and-protocol"></a>端口和协议配置

- 必须在所有节点上启用安全外壳 (SSH)。
- 必须在所有节点上启用互联网控制消息协议 (ICMP)。
- 所有完全限定的域名（FQDN）和别名主机名都必须能够在 DNS 中解析。正向和反向查找都必须成功。[enterprise type="inline" size="small" /]
- 所有 DC/OS 节点主机名均应解析为**本地可绑定** IP 地址。大多数应用程序都必需通过绑定到本地 IP 地址来解析主机名才能正常运行。无法通过绑定到本地 IP 地址来解析节点主机名的应用程序可能无法以非常规方式运行或行事。[enterprise type="inline" size="small" /]
- 每个节点均可从 bootstrap 节点访问网络。
- 每个节点均具有从本身到 DC/OS 群集中所有节点的不受限制 IP 至 IP 连接。
- 所有端口都应打开，以进行从管理节点到代理节点的通信，反之亦然。[enterprise type="inline" size="small" /]
- UDP 必须打开才能进入管理节点上的端口 53。为连接到群集，Mesos 代理节点服务 (`dcos-mesos-slave`) 使用此端口查找 `leader.mesos`。

DC/OS 用户与管理节点之间的中介（例如，执行 SSL 终止的反向代理）要求：

- 在向客户端发送任何数据之前，中介不必缓冲整个回复。
- 检测到客户端消失时，中介还应该关闭相应的上游 TCP 连接（即，中介
不应重复使用上游 HTTP 连接）。

### 高速互联网访问

建议为 DC/OS 安装使用高速互联网连接。DC/OS 服务需要每秒至少 10 MBit。如果工件下载时间超过文件 `/opt/mesosphere/etc/mesos-slave-common` 中 MESOS_EXECUTOR_REGISTRATION_TIMEOUT 的值，某些 DC/OS 服务的安装将失败。MESOS_EXECUTOR_REGISTRATION_TIMEOUT 的默认值为 10 分钟。

# 软件先决条件

* 在 XFS 使用 OverlayFS 时，应使用 -n ftype=1 标记创建 XFS 卷。请参阅 [Red Hat](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/7.2_release_notes/technology-preview-file_systems) 以及 [mesos](http://mesos.apache.org/documentation/latest/container-image/#provisioner-backends) 文档，以了解更多详情。

<p class="message--note"><strong>注意：</strong>名称服务缓存守护程序 'nscd' 或 'unscd.service' 必须禁用，因为它与 Mesos UCR 不兼容。</p>

## 所有节点

### Docker

Docker 必须安装在所有 bootstrap 和群集节点上。支持的 Docker 版本列于 [版本策略页面](https://docs.mesosphere.com/version-policy/)。

**建议**

- 确保 Docker 的 [`live-restore` 设置已禁用](https://docs.docker.com/config/containers/live-restore/)。在 Docker 配置文件中，应缺少此项或设置为 false。

- 不要在 `devicemapper` 模式下使用 Docker `loop-lvm` 存储驱动。如需更多信息，请参阅 [Docker 和 Device Mapper 存储驱动](https://docs.docker.com/engine/userguide/storagedriver/device-mapper-driver/)。

- 在选择生产存储驱动时，最好是 `direct-lvm` 模式下的 `OverlayFS` 或 `devicemapper`。如需更多信息，请参阅 Docker 的 <a href="https://docs.docker.com/engine/userguide/storagedriver/selectadriver/" target="_blank">选择存储驱动</a>。

- 使用 `systemd` 管理 CentOS 上的 Docker。`systemd` 将启动 Docker 并在它崩溃时帮助重启 Dcoker。

- 以根用户（带 `sudo`）或 <a href="https://docs.docker.com/engine/installation/linux/centos/#create-a-docker-group" target="_blank">docker 用户组</a>中用户的身份，运行 Docker 命令。

**分发特定的安装**

每个 Linux 系统分发都需要以特定方式安装 Docker：

- **CentOS/RHEL** - [从 Docker 的 Yum 存储库安装 Docker][1]。
- **CoreOS** - 提供时 Docker 已预先安装和配置。

如需更多信息，请参阅 Docker 的<a href="https://docs.docker.com/install/" target="_blank">分发特定的安装说明</a>。

### 禁用 sudo 密码提示

要禁用 sudo 密码提示，必须将以下行添加到 `/etc/sudoers` 文件。

```bash
%wheel ALL=(ALL) NOPASSWD: ALL
```

或者，您也可以作为 `root user` 执行 SSH。

### 启用 NTP

网络时间协议 (NTP) 必须在所有节点上启用，以便时钟同步。默认情况下，在 DC/OS 启动期间，如果未启用，将会出现错误。您可以通过运行以下一个命令来检查 NTP 是否启用，具体取决于操作系统和配置：

```bash
ntptime
adjtimex -p
timedatectl
```

## bootstrap 节点

在安装 DC/OS 之前，您**必须**确保 bootstrap 节点具备以下前提条件。

<p class="message--important"><strong>重要信息：</strong>如果您指定 `exhibitor_storage_backend: zookeeper`，bootstrap 节点将是群集的永久部分。有了 `exhibitor_storage_backend: zookeeper`，Mesos 管理节点的领导者状态和首要实例选举将在 bootstrap 节点上的 Exhibitor ZooKeeper 中维持。如需更多信息，请参阅<a href="/1.12/installing/production/advanced-configuration/configuration-reference/">配置参数文档</a>。</p>


- bootstrap 节点必须与群集节点分开。

### <a name="setup-file"></a>DC/OS 配置文件

- 下载 [dcos_generate_config 文件](https://support.mesosphere.com/hc/en-us/articles/213198586-Mesosphere-Enterprise-DC-OS-Downloads) 并将其保存到 bootstrap 节点。此文件用于创建自定义的 DC/OS 构建文件。请联系销售代表或 <a href="mailto:sales@mesosphere.com">sales@mesosphere.com</a> 以访问此文件。[enterprise type="inline" size="small" /]

- 下载 [dcos_generate_config 文件](https://downloads.dcos.io/dcos/stable/dcos_generate_config.sh) 并将其保存到 bootstrap 节点。此文件用于创建自定义的 DC/OS 构建文件。[oss type="inline" size="small" /]

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

 * 当前模式：`disabled`
 * 当前模式：`permissive`
 * 当前模式：`enforcing`，假定 `Loaded policy name` 为 `targeted`
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

[1]: /1.12/installing/production/system-requirements/docker-centos/

[2]: /1.12/installing/production/deploying-dcos/installation/
