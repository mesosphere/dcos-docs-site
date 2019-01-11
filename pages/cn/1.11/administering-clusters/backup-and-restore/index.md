---
layout: layout.pug
navigationTitle: 备份和恢复
title: 备份和恢复
menuWeight: 7
excerpt: 备份和恢复您集群的本地 Marathon 实例

enterprise: true
---

您可以备份您群集的  Marathon本地执行个体的状态，而之后能从该备份中恢复。

您可能会有需要在执行升级或降级之前备份群集。如果升级过程中发生错误或安装了未能按预期执行的 Universe 包，则可能需要将群集恢复至已知的良好状态。

# 限制

- 从 DC/OS 1.10 起，备份仅包括管理节点上运行的 Marathon 的状态。
- 您只能从 DC/OS Enterprise [备份和恢复 CLI](/cn/1.11/administering-clusters/backup-and-restore/backup-restore-cli/) 和 [备份和恢复 API](/cn/1.11/administering-clusters/backup-and-restore/backup-restore-api/) 执行备份和恢复操作。

<p class="message--important"><strong>重要信息：</strong>当您执行备份或恢复时，Marathon 被重新启动，以便能够以一致的状态执行操作。这不会影响运行中的任务，但如果当时某项任务正在启动某些操作，系统可能会出现短暂的不可用。</p>
