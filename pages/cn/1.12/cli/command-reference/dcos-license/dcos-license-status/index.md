---
layout: layout.pug
navigationTitle: dcos license status
title: dcos license status
menuWeight: 4
excerpt: 查看群集许可证状态

enterprise: true
---

# 说明
`dcos license status` 命令将显示群集许可证状态。

# 使用

```bash
dcos license status  [--terms] [--breaches]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| | `--terms` | 显示合同条款。|
| | `--breaches` | 显示违规数量。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos license] ](/1.11/cli/command-reference/dcos-license/) | 管理 DC/OS 群集许可证。 |

# 示例
有关示例，请参阅[许可证](/1.11/administering-clusters/licenses/)。
