---
layout: layout.pug
navigationTitle:  dcos backup
title: dcos backup
menuWeight: 2
excerpt: 创建备份并从其中恢复
enterprise: true
---


## 描述

`dcos backup` 命令让您可以创建备份并从中恢复。

# 使用

```
dcos backup [flags]
```

```
dcos backup [command]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--help, h` | 显示此命令的帮助。 |
| `--info` | 显示有关此命令的信息。 |


有关如何在 CLI 中创建备份的信息，请参阅 [备份和恢复 CLI](/cn/1.12/administering-clusters/backup-and-restore/backup-restore-cli/) 命令。此流程的限制可参见[备份和恢复限制部分](/cn/1.12/administering-clusters/backup-and-restore/#limitations)。

# 命令