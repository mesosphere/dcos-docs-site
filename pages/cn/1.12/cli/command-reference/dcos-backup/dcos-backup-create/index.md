---
layout: layout.pug
navigationTitle:  dcos backup create
title: dcos backup create
menuWeight: 10
excerpt: 创建备份 
enterprise: true
---

# 说明

`dcos backup create` 命令创建新备份。

# 使用

```
dcos backup create --label [label] [flags]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--help, h` | 显示此命令的帮助。 |
| `--label string` | 要附加到备份的标签。 |

# 示例

运行 `dcos backup create` 命令时，您必须为每个备份指定一个标签。运行命令时，将不会显示确认输出信息。但是，您可以运行 `dcos backup list`，查看您的备份是否已创建。

```bash
$ dcos backup create --label backup-1
$ dcos backup list
BACKUP ID                                         VERSION     STATUS                TIMESTAMP
---------                                         -------     ------                ---------
backup-1-fd4bdc87-889c-48c3-a656-9f8e96474b27     1.12.0      STATUS_BACKING_UP     2019-03-18 23:06:41.836197172 +0000 UTC
```

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [DCOS 备份](/1.12/cli/command-reference/dcos-backup/) | 创建、删除、列出、恢复和显示备份命令。 |


