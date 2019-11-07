---
layout: layout.pug
title: 磁盘分区
navigationTitle: 磁盘分区
menuWeight: 16
excerpt: 计划 DC/OS 群集的磁盘分区
---
在为 DC/OS 计划系统资源时，应特别注意如何对磁盘进行分区。为防止 DC/OS 在磁盘空间上运行慢或磁盘空间不利地影响群集操作，应创建独立分区，以隔离 I/O 密集型服务，例如，`journald`从 ZooKeeper 和 CockroachDB 等关键基础设施服务记录设施进程和 Mesos 沙盒。使用单独的分区可帮助确保容错群集操作，并将磁盘空间错误的范围（ENOSPC - 设备上没有剩余空间错误）限制在可恢复的问题，例如，未能部署的任务。

# 建议的分区布局
您可以使用以下指南来计划复制状态存储的磁盘分区和在 `/var/lib/dcos` 下的永久配置覆盖位置。

## 管理节点
对于管理节点，建议的做法是在由 **快速**、**本地连接**存储 (SSD/NVMe) 支持的单独分区上托管 `/var/lib/dcos` 目录。在管理节点上使用这种单独的分区可以让以下复制状态存储和永久配置覆盖文件存储在 `/var/lib/dcos` 目录之下：
- Mesos Paxos 复制日志：/var/lib/dcos/mesos/master/replicated_log
- Navstar Overlay 复制日志：/var/lib/dcos/mesos/master/overlay_replicated_log
- CockroachDB 分布式数据库：/var/lib/dcos/cockroach
- Navstar Mnesia 分布式数据库：/var/lib/dcos/navstar/mnesia
- Navstar Lashup 分布式数据库：/var/lib/dcos/navstar/lashup
- 密钥保管库：/var/lib/dcos/secrets/vault
- ZooKeeper 分布式数据库：/var/lib/dcos/exhibitor/zookeeper
-  历史服务缓存：/var/lib/dcos/dcos-history

## 代理节点
代理节点上，应当将单独的分区用于 `/var/lib/mesos` 下的下列目录：

- `/var/lib/mesos` - 应始终在独立分区上托管 `/var/lib/mesos` 目录。请记住，Apache Mesos 在其 UI 中广告的磁盘空间是支撑 `/var/lib/mesos` 目录的文件系统提供的空间之和，包括任何挂载卷 (`/dcos/volume<n>`)。

- `/var/lib/mesos/slave/slaves` - 该目录托管任务的沙盒目录。如有可能，应为此目录使用单独的分区。

- `/var/lib/mesos/slave/volumes` - 该目录由消耗 ROOT 永久卷的框架使用。如有可能，应为此目录使用单独的分区。

- `/var/lib/mesos/slave/store/docker` - 该目录存储用于调配 UCR 容器的 Docker 镜像层。如有可能，应为此目录使用单独的分区。

大多数情况下，代理节点不需要将单独分区用于存储在 `/var/lib/dcos` 目录中的永久配置覆盖文件。然而，您应确保为代理节点上的以下配置文件允许足够的磁盘空间分区：
- `/var/lib/dcos/mesos-slave-common`
- `/var/lib/dcos/mesos-resources`

<p class="message--note"><strong>注意：</strong>对于整体群集运行状况，请记住，`/var/lib/mesos/slave/meta/resources`、`/var/lib/mesos/slave/volumes` 和 `/dcos/volume<n>` 装载目录必须可用（或从备份恢复），以便将预订重新发布到框架。提供单独的分区以确保这些目录和资源提供的可用性允许操作和任务成功恢复。

## 其他目录和分区
除管理节点和代理节点特定的分区以外，还应考虑为以下每个目录使用单独的分区：

- `/var/lib/docker` - 该目录存储 Docker 镜像层，并由通过 Docker 引擎启动的容器使用。

- `/dcos/volume<n>` - 这些卷识别的目录，例如`/dcos/volume0` 和 `/dcos/volume1`，用于消耗装载持久性卷的框架。

- `/opt/mesosphere` - 该目录包含 DC/OS 二进制文件、库和群集配置。如果 DC/OS 群集为 1.11 版或更新版，则应将该目录放在它自己的分区。由于该目录的大小往往随每次 DC/OS 升级而增加，并且旧文件没有自动清理，因此应认真监控 `/opt/mesosphere` 目录的磁盘空间使用情况。除监控目录以外，您可能还需要创建一个自定义脚本来定期删除未使用或过期的文件。

所有这些文件系统路径和挂载点都应该在自己的隔离输入/输出 (IO) 路径上，向下到它们所在的物理设备，以最大程度减少 I/O 竞争。
