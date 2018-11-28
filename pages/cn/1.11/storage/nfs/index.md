---
layout: layout.pug
navigationTitle: NFS 服务器
excerpt: 挂载共享网络驱动器
title: NFS 服务器
menuWeight: 1
---



# 概述

对于某些有状态的服务，如 Jenkins，可以方便地将共享网络驱动器挂载到每个节点。如果使用中的节点不可用，则共享网络驱动器可以在新节点上启动任务。

<table class=“table” bgcolor=#7d58ff>
<tr> 
  <td align=justify style=color:white><strong>注意：</strong>此示例使用 CoreOS 和 `systemd`，且尚未在其他环境中进行测试。</td> 
</tr> 
</table>


### 注意

- 这些说明是 CoreOS 专属的。
- 这不是 HA NFS 服务器。它在单个管理节点上运行，只能用作概念证明。
- 如果您有权访问预先存在的 NFS 或其他网络存储，请跳转到[配置代理程序以挂载驱动器
](#agent)。
### 使用文件共享配置管理节点

1. 使用 DC/OS 命令行界面登录管理节点：

    ```bash
    dcos node ssh --master-proxy --leader
    ```

1. 为 NFS 运行时信息设置文件夹：

    ```bash
    sudo mkdir /var/lib/nfs
    ```

1. 写一个 `/etc/exports` 文件以描述要导出的文件夹。将路径 `/data` 替换为导出文件夹的绝对路径，将 CIDR 范围 `10.0.1.0/24` 替换为您的子网的适当范围：

    ```bash
    cat /etc/exports
    /data 10.0.1.0/24(rw,async,no_subtree_check,no_root_squash,fsid=0)
    ```

1. 启动 `rpc-mountd` 和 `nfsd`：

    ```bash
    sudo systemctl start rpc-mountd
    sudo systemctl start nfsd
    ```

1. 启用 `rpc-mountd` 和 `nfsd` 进行自动启动：

    ```bash
    sudo systemctl enable rpc-mountd
    sudo systemctl enable nfsd
    ```

<a name="agents"></a>

### 配置代理程序以挂载驱动器

1. 列出集群中的节点：

    ```bash
    dcos node
     HOSTNAME       IP                         ID
    10.0.1.251  10.0.1.251  68ded4c8-8808-4a41-b460-7171355b2037-S1
    10.0.1.252  10.0.1.252  68ded4c8-8808-4a41-b460-7171355b2037-S0
    ```

1. 通过 SSH 连接到节点：

    ```bash
    dcos node ssh --master-proxy --mesos-id=68ded4c8-8808-4a41-b460-7171355b2037-S0
    ```

1. 使新文件夹挂载如：

    ```bash
    sudo mkdir /mnt/data
    ```

1. 为 NFS 运行时信息设置文件夹：

    ```bash
    sudo mkdir /var/lib/nfs
    ```

1. 创建新的 `systemd` 挂载单元以描述挂载。`.mount` 文件的名称与挂载点的路径相同，删除了前面的斜杠，其他斜杠转换为破折号。使用 `/mnt/data` 作为示例，文件命名为 `mnt-data.mount`。另外，将 `10.0.7.181` 替换为 NFS 主机的 IP。[更多信息可在 CoreOS 文档中找到][1]：

    ```bash
    cat /etc/systemd/system/mnt-data.mount
    [Mount]
    What=10.0.7.181:/data
    Where=/mnt/data
    Type=nfs
    ```

1. 通过使用 `touch` 来测试新挂载，以创建文件：

    ```bash
    touch /mnt/data/test.txt
    ```

[1]:https://coreos.com/os/docs/latest/moun-storage.html
