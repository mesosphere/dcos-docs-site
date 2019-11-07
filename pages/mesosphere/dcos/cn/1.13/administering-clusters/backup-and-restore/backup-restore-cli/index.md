---
layout: layout.pug
navigationTitle:  备份和恢复 CLI
title: 备份和恢复 CLI
menuWeight: 0
excerpt: 使用 CLI 备份和恢复群集
enterprise: true
渲染：胡须
模型：/mesosphere/dcos/1.13/data.yml
---
您可以使用 CLI 来创建和恢复群集的备份。您还可以选择备份和恢复 DC/OS 群集内运行的 [ZooKeeper](#zookeeper) 状态。


# 先决条件
- 一个 DC/OS Enterprise 群集。
- [DC/OS CLI](/mesosphere/dcos/1.13/cli/install/) 已安装。
- [DC/OS Enterprise CLI](/mesosphere/dcos/1.13/cli/enterprise-cli/) 已安装。

<p class="message--important"><strong>重要信息：</strong>查看备份和恢复的<a href="/mesosphere/dcos/latest/administering-clusters/backup-and-restore/#limitations">限制</a>部分。</p>


# 备份群集

备份存储在管理节点的本地文件系统上。备份状态由在群集中运行的服务维护，并通过直接使用此服务来初始化备份/恢复操作。

1. 创建备份并对其分配一个有意义的标签。标签有以下限制：
   - 长度必须介于 3 到 25 个字符之间。
   - 不能以 `..`开始。
   - 必须由以下字符组成：[A-Za-z0-9_.-]。

   ```bash
   dcos backup create --label=<backup-label>
   ```

1. 验证您的备份是否已创建。

   ```bash
   dcos backup list
   ```

   或使用以下命令将搜索结果限制为您创建备份时使用的标签。

   ```bash
   dcos backup list [label]
   ```

   备份最初将过渡到 `STATUS_BACKING_UP` 状态，并且最终应进入 `STATUS_READY`状态。如果出现错误，它将显示一个 `STATUS_ERROR`状态。使用 `dcos backup show <backup-id>` 找出在备份过程中 Marathon 出错的原因。

1. 在后续命令中使用由 `dcos backup list` 产生的 ID 引用您的备份。备份 ID 类似于 `<backup-label>-ea6b49f5-79a8-4767-ae78-3f874c90e3da`。

## 删除备份

删除不需要的备份。

   ```bash
   dcos backup delete <backup-id>
   ```

# 恢复群集

1. 列出可用备份，选择要恢复的备份并记录备份 ID。

   ```bash
   dcos backup list
   ```

1. 从所选备份中恢复。

   ```bash
   dcos backup restore <backup-id>
   ```

1. 监控恢复操作的状态。

   ```bash
   dcos backup show <backup-id>
   ```

JSON 输出的`restores.component_status.marathon`参数将显示 `STATUS_RESTORING`，然后显示 `STATUS_READY`。

<a name="zookeeper"></a>

# ZooKeeper 备份和恢复

该部分介绍备份和恢复 DC/OS 群集内运行的 ZooKeeper 状态的过程。

备份 Zookeeper 将允许您将群集返回到已知的良好状态。因此，我们强烈建议您定期备份 Zookeeper 状态，为最坏情况做准备。执行维护操作时，例如升级或降级，在开始维护之前，您可能希望备份 Zookeeper 状态。

<p class="message--important"><strong></strong>重要信息：
从备份恢复 Zookeeper 应该是恢复 DC/OS 群集的最后方法。仅在确认群集遭受永久数据丢失（包括 Zookeeper 状态）后才适用。
</p>


## 备份 ZooKeeper 群集

DC/OS 内的 Zookeeper 群集是在成员节点之间提供分布式一致性的系统。Zookeeper 的实例在每个管理节点上运行，这些实例服务于整个群集。只有当群集中的所有节点看到并同意某个值时，Zookeeper 状态才能继续进行。这意味着，任何一个 Zookeeper 节点的状态将包含到某个时间点之前的整个状态信息。因此，备份一个 ZOOKEEPER 节点足以合理地接近 Zookeeper 群集备份的最新状态。创建备份需要时间，因此，备份结束时的实时系统最有可能不再反映当前状态。但是，将捕获程序开始时可用的数据。

## 先决条件

* 确保有足够的磁盘空间以在特定管理节点上临时存储 Zookeeper 备份。
* 任何 shell 命令都必须以有特权的 Linux 用户身份发出。

1. 通过 Exhibitor `systemd` 单元仅停止一个特定管理节点上的 Zookeeper 实例。

    ```bash
    systemctl stop dcos-exhibitor
    ```

1. 通过提供的 DC/OS Zookeeper 备份脚本在同一管理节点上创建 ZooKeeper 备份。

    ```bash
    /opt/mesosphere/bin/dcos-shell dcos-zk backup <backup-tar-archive-path> -v
    ```

1. 在同一管理节点上重新启动先前停止的 Zookeeper 实例。

    ```bash
    systemctl start dcos-exhibitor
    ```

1. 将已创建的 Zookeeper 备份 tar 存档从该管理节点下载到 DC/OS 群集之外的安全位置。

1. 从管理节点上删除 Zookeeper 备份 tar 存档。

## 从 Zookeeper 备份中恢复

您可以从单个 ZooKeeper 节点备份中恢复，该备份已物理地复制到群集中的所有 ZooKeeper 节点上。
这样可以确保所有节点都从记录的相同状态返回操作，直到备份过程完成为止。恢复要求停止所有 Zookeeper 节点，这意味着仅当中断可容忍或正在进行时，这才是一个选择。

1. 将之前创建的单个 Zookeeper 备份 tar 存档复制到每个管理节点的文件系统里。

1. 通过 Exhibitor `systemd` 单元停止每个管理节点上的 Zookeeper 实例。

    ```bash
    systemctl stop dcos-exhibitor
    ```

1. 通过提供的 DC/OS Zookeeper 恢复脚本在每个管理节点上启动恢复程序。

    ```bash
    /opt/mesosphere/bin/dcos-shell dcos-zk restore <backup-tar-archive-path> -v
    ```

1. 在每个管理节点上重新启动先前停止的 Zookeeper 实例。

    ```bash
    systemctl start dcos-exhibitor
    ```

1. 通过 Exhibitor 群集状态 API 端点监控 DC/OS 群集的 Exhibitor 状态（无需身份认证）。

    ```bash
    curl https://<master-host-ip>/exhibitor/exhibitor/v1/cluster/status
    [
      {
        "code": 3,
        "description": "serving",
        "hostname": "172.31.12.169",
        "isLeader": true
      },
      {
        "code": 3,
        "description": "serving",
        "hostname": "172.31.13.255",
        "isLeader": false
      },
      {
        "code": 3,
        "description": "serving",
        "hostname": "172.31.17.144",
        "isLeader": false
      }
    ]
    ```

当所有实例都处于 `serving` 状态且领导者已选举时，则恢复程序成功。


## Zookeeper 备份的限制
- 在当前表单中备份 Zookeeper 状态需要停止一个 ZooKeeper 节点。在您使用 3 个管理节点的情况下，这显著降低了进行备份时 DC/OS 群集管理节点中断的容忍度，而在使用 5 个管理节点时对恢复力的影响较小。
- 从 Zookeeper 备份中恢复需要停止 DC/OS 内所有 Zookeeper 实例。因此，仅建议将此作为恢复用其他方式无法恢复的群集的最后方法。
