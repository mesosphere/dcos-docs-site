---
layout: layout.pug
navigationTitle: dcos license list
title: dcos license list
menuWeight: 2
excerpt: 显示集群许可证

enterprise: true
---

# 说明
`dcos license list` 命令将显示所有集群许可证。

# 使用

```bash
dcos license list --output <file_path>
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| | `--output` | 将许可证存储在文件中。|


# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<file_path>` | 存储许可证的文件的路径。|


# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos license] ](/cn/1.11/cli/command-reference/dcos-license/) | 管理 DC/OS 集群许可证。 |

# 示例
有关示例，请参阅[许可证](/cn/1.11/administering-clusters/licenses/)。
