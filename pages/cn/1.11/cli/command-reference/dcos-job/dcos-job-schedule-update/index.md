---
layout: layout.pug
navigationTitle: dcos job schedule update
title: dcos job schedule update
menuWeight: 9
excerpt: 更新作业时间表

enterprise: false
---

    
# 说明
`dcos job schedule update` 命令让您更新作业时间表。

# 使用

```bash
dcos job schedule update <job-id> <schedule-file> [OPTION]
```

# 选项

无。

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<job-id>`   |  显示 job ID。您可以使用 `dcos job list` 指令查看 job ID。|
| `<schedule-file>` | 以 JSON 为格式的作业时间表文件。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
|  [dcos job](/cn/1.11/cli/command-reference/dcos-job/)  | 在 DC/OS 中部署和管理作业。|


