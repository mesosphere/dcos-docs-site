---
layout: layout.pug
navigationTitle:  dcos job schedule add
title: dcos job schedule add
menuWeight: 6
excerpt: 向作业添加时间表

enterprise: false
---


# 说明
`dcos job schedule add` 命令让您将时间表添加到作业中。

# 使用

```bash
dcos job schedule add <job-id> <schedule-file>
```

# 选项

| 名称 | 说明 |
|---------|-------------|
|`-h`，`--help` | 打印用法。 |

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<job-id>` | 指定作业 ID。您可以使用 `dcos job list` 命令查看作业 ID。 |
| `<schedule-file>` | JSON 格式的作业时间表文件。|


# 示例

有关使用 `job add` 的示例请参阅 [文档](/cn/1.12/deploying-jobs/examples/#create-job-schedule)。

# 父命令

| 命令 | 说明 |
|---------|-------------|
|  [dcos job](/cn/1.12/cli/command-reference/dcos-job/)  | 在 DC/OS 中部署和管理作业。|
