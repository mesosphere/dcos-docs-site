---
layout: layout.pug
navigationTitle:  dcos job list
title: dcos job list
menuWeight: 3
excerpt: 显示所有作业定义
enterprise: false
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---


# 说明
`dcos jobs list` 命令允许您显示所有作业定义。

# 使用

```bash
dcos job list [--json|--quiet]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `-h`，`--help` | 显示此命令的使用。 |
| `--json` | 打印 JSON 格式列表而不是表格。 |
| `-q`，`--quiet` | 表示仅导致运行 ID 阵列的静默模式。 |

# 父命令

| 命令 | 说明 |
|---------|-------------|
|  [dcos job](/mesosphere/dcos/cn/2.0/cli/command-reference/dcos-job/)  | 在 DC/OS 中部署和管理作业。|
