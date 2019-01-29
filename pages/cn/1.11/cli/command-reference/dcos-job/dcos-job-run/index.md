---
layout: layout.pug
navigationTitle: dcos job run
title: dcos job run
menuWeight: 5
excerpt: 运行 DC/OS 作业

enterprise: false
---



# 说明
`dcos job run` 命令让您立即运行作业。

# 使用

```bash
dcos job run <job-id> [OPTION]
```

# 选项

无。

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<job-id>`   |   Specify the job ID. You can view the job IDs with the `dcos job list` 命令。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
|  [dcos job](/cn/1.11/cli/command-reference/dcos-job/)  | 在 DC/OS 中部署和管理作业。|

# 示例

## 运行作业

在此示例中，您可以运行名为 `my-job`的作业。

```bash
dcos job run my-job
```

