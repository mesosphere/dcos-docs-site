---
layout: layout.pug
navigationTitle: dcos license audit get
title: dcos license audit get
menuWeight: 0
excerpt: 获取集群许可证审计记录

enterprise: true
---

# 说明
`dcos license audit get` 命令让您查看集群许可证审计记录。

# 使用

```bash
dcos license audit get [<id>|active] [--output <file_path>] [--decrypt]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| | `--output` | 将审计记录存储在文件中。 |
| | `--decrypt` | 将许可证审计记录校验和解密。 |


# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<id> ` | 许可证的 ID。 |
| | `active` | 有效许可证。 |
| `<file_path>` | 存储审计记录的文件路径。 |


# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos license] ](/cn/1.11/cli/command-reference/dcos-license/) | 管理 DC/OS 集群许可证。 |

# 示例
有关示例，请参阅[许可证](/cn/1.11/administering-clusters/licenses/)。
