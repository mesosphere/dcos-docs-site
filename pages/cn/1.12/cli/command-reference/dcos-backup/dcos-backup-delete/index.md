---
layout: layout.pug
navigationTitle:  dcos backup delete
title: dcos backup delete
menuWeight: 20
excerpt: 删除备份 
enterprise: true
---

# 说明

`dcos backup delete` 命令将删除现有备份。

# 使用

```
dcos backup delete <backup id> [flags]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--help, h` | 显示此命令的帮助。 |

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<backup id>` | 现有备份的 ID 编号或标签。 |

# 示例

查看 [`dcos backup list`](/../dcos-backup/dcos-backup-list/) 的文档，获取备份 ID。

1. 运行 `dcos backup list` 命令获取备份列表。

    ```bash
    $ dcos backup list
    BACKUP ID                                         VERSION     STATUS           TIMESTAMP
    ---------                                         -------     ------           ---------
    backup-1-fd4bdc87-889c-48c3-a656-9f8e96474b27     1.12.0      STATUS_READY     2019-03-18 23:06:41.836197172 +0000 UTC
    backup2-c55c20e9-ba3f-46a6-b944-20a790b5491a      1.12.0      STATUS_READY     2019-03-18 23:15:47.639999548 +0000 UTC
    backup3-317c19df-34e4-41a0-93c9-d66c7f307208      1.12.0      STATUS_BACKING_UP     2019-03-18 23:16:33.265478871 +0000 UTC
    ```

1. 使用备份 ID 删除备份：

    ```
    dcos backup delete backup-1-fd4bdc87-889c-48c3-a656-9f8e96474b27
    ```

 备份将被删除，但没有确认输出信息。

1. 但是，如果您再次运行 `dcos backup list` ，就看不到列出的备份，这表示备份已删除。

    ```bash
    dcos backup list
    BACKUP ID                                        VERSION     STATUS                TIMESTAMP
    ---------                                        -------     ------                ---------
    backup2-c55c20e9-ba3f-46a6-b944-20a790b5491a     1.12.0      STATUS_READY          2019-03-18 23:15:47.639999548 +0000 UTC
    backup3-317c19df-34e4-41a0-93c9-d66c7f307208     1.12.0      STATUS_BACKING_UP     2019-03-18 23:16:33.265478871 +0000 UTC
    ```

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [DCOS 备份](/1.12/cli/command-reference/dcos-backup/) | 创建、删除、列出、恢复和显示备份命令。 |

