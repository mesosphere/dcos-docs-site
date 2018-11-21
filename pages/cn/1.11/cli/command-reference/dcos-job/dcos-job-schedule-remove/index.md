---
layout: layout.pug
navigationTitle: dcos job schedule remove
title: dcos job schedule remove
menuWeight: 7
excerpt: 删除作业时间表

enterprise: false
---


# 说明
`dcos job schedule remove` 命令让您删除作业时间表。

# 使用

```bash
dcos job schedule remove <job-id> <schedule-file> [OPTION]
```

# 选项

无。

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<job-id>`   |  Specify the job ID.  You can view the job IDs with the `dcos job list` 命令。|
| `<schedule-file>` | 以 JSON 为格式的作业时间表文件。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
|  [dcos job](/cn/1.11/cli/command-reference/dcos-job/)  | 在 DC/OS 中部署和管理作业。|

# 示例

## 删除作业

在本示例中，一个名为 `my-job` 的作业被删除。

```bash
dcos job remove my-job
```


