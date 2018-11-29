---
layout: layout.pug
navigationTitle: dcos job remove
title: dcos job remove
menuWeight: 4
excerpt: 删除作业

enterprise: false
---

    
# 说明
`dcos job remove` 命令允许您删除作业。

# 使用

```bash
dcos job remove <job-id> [OPTION]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| | `--stop-current-job-runs` | 删除所有运行的作业。|

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<job-id>`   |  Specify the job ID. You can view the job IDs with the `dcos job list` 命令。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
|  [dcos job](/cn/1.11/cli/command-reference/dcos-job/)  | 在 DC/OS 中部署和管理作业。|

# 示例

## 删除作业

在本示例中，带有 ID `my-job` 的作业被删除。

```bash
dcos job remove my-job
```

