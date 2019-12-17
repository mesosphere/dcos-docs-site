---
layout: layout.pug
navigationTitle:  备份和恢复
title: 备份和恢复
menuWeight: 7
excerpt: 备份和恢复群集的重要部分
render: mustache
model: /mesosphere/dcos/2.0/data.yml
--- 

您可能希望在执行升级或降级之前备份群集。如果升级过程中发生错误或安装了未按预期执行的 {{ model.packageRepo }} 包，则可能需要将群集恢复至已知的良好状态。

本部分提供有关如何通过专用程序备份和恢复特定 DC/OS 组件状态的指导。

DC/OS Enterprise 用户可能希望使用 DC/OS 备份服务来备份和恢复本机 DC/OS Marathon 实例状态。您可以备份您群集的本地  Marathon 实例的状态，而后从该备份中恢复。您还可以选择备份和恢复 DC/OS 群集内运行的 [ZooKeeper](/mesosphere/dcos/cn/2.0/administering-clusters/backup-and-restore/backup-restore-cli/#zookeeper-backup-and-restore) 状态。


# 限制

- 从 DC/OS 1.10 起，备份仅包括管理节点上运行的 Marathon 的状态。
- 您只能从 DC/OS Enterprise [备份和恢复 CLI](/mesosphere/dcos/cn/2.0/administering-clusters/backup-and-restore/backup-restore-cli/) 和 [备份和恢复 API](/mesosphere/dcos/cn/2.0/administering-clusters/backup-and-restore/backup-restore-api/) 执行备份和恢复操作。

<p class="message--important"><strong>重要信息：</strong>当您执行备份或恢复时，Marathon 被重新启动，以便以一致的状态执行操作。这不会影响正在运行的任务，但如果当时某项任务正在启动某些操作，则可能会出现短暂的不可用。</p>



