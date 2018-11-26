---
layout: layout.pug
navigationTitle: 备份和恢复 CLI
title: 备份和恢复 CLI
menuWeight: 0
excerpt: 使用 CLI 备份和恢复集群

enterprise: true
---

# 先决条件
- 一个 DC/OS Enterprise 集群。
- [DC/OS CLI](/cn/1.11/cli/install/) 已安装。
- [DC/OS Enterprise CLI](/cn/1.11/cli/enterprise-cli/) 已安装。

<table class=“table” bgcolor=#858585>
<tr> 
  <td align=justify style=color:white><strong>重要信息：</strong>查看备份和恢复的 <a href="/1.11/administering-clusters/backup-and-restore/#limitations">限制</a> 。</td> 
</tr> 
</table>


# 备份集群

备份存储在管理节点的本地文件系统上。备份状态由在集群中运行的服务维护，并通过直接使用此服务来进行备份/恢复操作。

1. 创建备份并对其分配一个有意义的标签。
 标签有以下限制：
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

 或使用以下命令将搜索结果细化为您创建备份时使用的标签。

   ```bash
   dcos backup list [label]
   ```

 备份最初将过渡到 `STATUS_BACKING_UP` 状态，并且最终应进入 `STATUS_READY`状态。如果出现错误，它将显示一个 `STATUS_ERROR`状态。使用`dcos backup show <backup-id>` 检查在备份过程中 Marathon 出错的原因。

1. 在后续命令中使用由 `dcos backup list` 产生的 ID 指代您的备份。备份 ID 类似于 `<backup-label>-ea6b49f5-79a8-4767-ae78-3f874c90e3da`。

# 删除备份

1. 删除不需要的备份。

   ```bash
   dcos backup delete <backup-id>
   ```

# 恢复集群

1. 列出可用备份，选择要恢复的备份并记录下备份 ID。

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
