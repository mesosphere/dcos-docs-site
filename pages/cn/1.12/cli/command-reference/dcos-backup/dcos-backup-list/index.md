---
layout: layout.pug
navigationTitle:  dcos backup list
title: dcos backup list
menuWeight: 30
excerpt: 列出备份 
enterprise: true
---

# 说明
`dcos backup list` 命令将列出所有已知备份。

# 使用

```bash
dcos backup list [prefix] [flags]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--help, h` | 显示此命令的帮助。 |
| `--json` | 以 JSON 格式显示输出。 |

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `prefix` | 识别用于排序的附加到文件名的前缀。 |


# 示例

## 列出所有备份

```bash
$ dcos backup list
BACKUP ID                                         VERSION     STATUS           TIMESTAMP
---------                                         -------     ------           ---------
backup-1-fd4bdc87-889c-48c3-a656-9f8e96474b27     1.12.0      STATUS_READY     2019-03-18 23:06:41.836197172 +0000 UTC
backup2-c55c20e9-ba3f-46a6-b944-20a790b5491a      1.12.0      STATUS_READY     2019-03-18 23:15:47.639999548 +0000 UTC
backup3-317c19df-34e4-41a0-93c9-d66c7f307208      1.12.0      STATUS_BACKING_UP     2019-03-18 23:16:33.265478871 +0000 UTC
```

## 仅列出以“backup-”开头的备份

```
dcos backup list backup-
BACKUP ID                                         VERSION     STATUS           TIMESTAMP
---------                                         -------     ------           ---------
backup-1-fd4bdc87-889c-48c3-a656-9f8e96474b27     1.12.0      STATUS_READY     2019-03-18 23:06:41.836197172 +0000 UTC
```

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [DCOS 备份](/1.12/cli/command-reference/dcos-backup/) | 创建、删除、列出、恢复和显示备份命令。 |

