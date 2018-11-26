---
layout: layout.pug
navigationTitle: dcos license get
title: dcos license get
menuWeight: 1
excerpt: 显示集群许可证

enterprise: true
---

# 说明
`dcos license get` 命令让您查看集群许可证。

# 使用

```bash
dcos license get [<id>|active] [--output <file_path>] [--decryption-key]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
|   |   |
| | `--output` | 将许可证存储在文件中。|
| | `--decryption-key` | 获取解密许可证审计记录的密钥。 |


# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<id> ` | 许可证的 ID。 |
| | `active` | 有效许可证。 |
| `<file_path>` | 存储许可证的文件的路径 |

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos license] ](/cn/1.11/cli/command-reference/dcos-license/) | 管理 DC/OS 集群许可证。 |

# 示例
有关示例，请参阅[许可证](/cn/1.11/administering-clusters/licenses/)。
