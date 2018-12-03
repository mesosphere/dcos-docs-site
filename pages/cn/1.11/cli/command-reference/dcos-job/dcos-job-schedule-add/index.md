---
layout: layout.pug
navigationTitle: dcos job schedule add
title: dcos job schedule add
menuWeight: 6
excerpt: 向作业添加时间表

enterprise: false
---


# 说明
`dcos job schedule add` 命令允许您将时间表添加到作业中。

# 使用

```bash
dcos job schedule add <job-id> <schedule-file> [OPTION]
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

# 示例

有关使用 `job add` 的示例请参阅 [文档](/cn/1.11/deploying-jobs/examples/#create-job-schedule)。
