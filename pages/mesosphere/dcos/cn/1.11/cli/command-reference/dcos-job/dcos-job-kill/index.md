---
layout: layout.pug
navigationTitle: dcos job kill
title: dcos job kill
menuWeight: 2
excerpt: 结束 DC/OS 作业
enterprise: false
---


# 说明
`dcos job kill` 命令让您终止指定的作业。

# 使用

```bash
dcos job kill <job-id> [OPTION]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| | `run-id` | 作业运行 ID。|
| | `--all` | 终止所有运行的作业。|

# 位置自变量

| 名称、简写 | D描述 |
|---------|-------------|
| `<job-id>`   |  指定作业ID。 您可以使用以下命令查看作业ID `dcos job list` 命令。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
|  [dcos job](/mesosphere/dcos/cn/1.11/cli/command-reference/dcos-job/)  | 在 DC/OS 中部署和管理作业。|
