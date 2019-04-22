---
layout: layout.pug
navigationTitle:  dcos backup show
title: dcos backup show
menuWeight: 50
excerpt: 查看备份详情 
enterprise: true
---

# 说明

`dcos backup show` 命令显示指定备份的详细信息。

# 使用

```bash
dcos backup show <backup id> [flags]
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

1. 要查找所有备份的备份 ID，请运行 `dcos backup list`。

    ```bash
    $ dcos backup list
    BACKUP ID                                        VERSION     STATUS           TIMESTAMP
    ---------                                        -------     ------           ---------
    backup2-c55c20e9-ba3f-46a6-b944-20a790b5491a     1.12.0      STATUS_READY     2019-03-18 23:15:47.639999548 +0000 UTC
    backup3-317c19df-34e4-41a0-93c9-d66c7f307208     1.12.0      STATUS_READY     2019-03-18 23:16:33.265478871 +0000 UTC
    ```

1. 现在您可以使用备份 ID 运行 `dcos backup show` 命令：

    ```json
    $ dcos backup show backup3-317c19df-34e4-41a0-93c9-d66c7f307208
    {
        "dcos_version": "1.12.0",
        "id": "backup3-317c19df-34e4-41a0-93c9-d66c7f307208",
        "component_status": {
            "marathon": {
                "status": "STATUS_READY"
            }
        },
        "timestamp": "2019-03-18T23:16:33.265478871Z",
        "status": "STATUS_READY"
    }
    ```

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [DCOS 备份](/1.12/cli/command-reference/dcos-backup/) | 创建、删除、列出、恢复和显示备份命令。 |

