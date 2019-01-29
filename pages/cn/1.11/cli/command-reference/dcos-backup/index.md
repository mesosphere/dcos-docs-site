---
layout: layout.pug
navigationTitle: dcos backup
title: dcos backup
menuWeight: 2
excerpt: 创建备份并从其中恢复

enterprise: true
---


## dcos backup
`dcos backup` 命令允许您创建备份并从中恢复。

```
dcos backup
Usage:
    dcos backup --help
    dcos backup --info
    dcos backup --version
    dcos backup create --label=<backup-label>
    dcos backup restore <id>
    dcos backup list [--json] [<prefix>]
    dcos backup show [--json] <id>
    dcos backup delete <id>
```

表 1. 选项

| 名称 | 说明 |
|---------|-------------|
| | `--help, h` | 显示使用情况。|
| | `--info` | 显示选项。 |
| | `--version` | 显示版本信息。 |
| | `create` | 创建备份。--标签=<backup-label> 选项将为备份提供标签。|
| | `restore` | 恢复特定备份。<id> 是备份的唯一标识符。 |
| | `list` | 显示所有备份的列表。使用此选项验证您的备份是否已创建。 |
| | `show` | 显示备份 ID 的列表。 |
| | `delete` | 删除特定备份。<id> 是备份的唯一标识符。 |


有关如何从 CLI 创建备份的信息，请参阅 [备份和恢复 CLI](/cn/1.11/administering-clusters/backup-and-restore/backup-restore-cli/)。此流程的限制可参见[备份和恢复限制部分](/cn/1.11/administering-clusters/backup-and-restore/#limitations)。
