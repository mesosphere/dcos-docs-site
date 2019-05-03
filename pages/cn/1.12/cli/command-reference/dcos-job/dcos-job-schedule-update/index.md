---
layout: layout.pug
navigationTitle:  dcos job schedule update
title: dcos job schedule update
menuWeight: 9
excerpt: 更新作业时间表
enterprise: false
---


# 说明
`dcos job schedule update` 命令可以让您更新作业的时间表。

# 使用

```bash
dcos job schedule update <job-id> <schedule-file>
```

# 选项

| 名称 | 说明 |
|---------|-------------|
|`-h`，`--help` | 打印用法。 |

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<job-id>` | 指定作业 ID。您可以使用 `dcos job list` 命令查看作业 ID。|
| `<schedule-file>` | JSON 格式的作业时间表文件。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
|  [dcos job](/cn/1.12/cli/command-reference/dcos-job/)  | 在 DC/OS 中部署和管理作业。|


