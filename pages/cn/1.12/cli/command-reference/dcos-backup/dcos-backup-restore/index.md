---
layout: layout.pug
navigationTitle:  dcos backup restore
title: dcos backup restore
menuWeight: 30
excerpt: 恢复备份 
enterprise: true
---

# 说明

`dcos backup restore` 命令将恢复现有备份。

# 使用

```bash
dcos backup restore <backup id> [flags]
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

1. 恢复现有备份需要使用备份 ID。运行命令 `dcos backup list` 获取备份列表。

    ```
    $ dcos backup list
    BACKUP ID                                        VERSION     STATUS           TIMESTAMP
    ---------                                        -------     ------           ---------
    backup2-c55c20e9-ba3f-46a6-b944-20a790b5491a     1.12.0      STATUS_READY     2019-03-18 23:15:47.639999548 +0000 UTC
    backup3-317c19df-34e4-41a0-93c9-d66c7f307208     1.12.0      STATUS_READY     2019-03-18 23:16:33.265478871 +0000 UTC
    ```

1. 然后使用相应的备份 ID 运行 `dcos backup restore` 命令：

    ```bash
    $ dcos backup restore backup2-c55c20e9-ba3f-46a6-b944-20a790b5491a
    ```

 系统不会显示确认消息。
    
1. 但是，如果您再次运行 `dcos backup list`，就会看到列出的备份，这表示备份已恢复。

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

