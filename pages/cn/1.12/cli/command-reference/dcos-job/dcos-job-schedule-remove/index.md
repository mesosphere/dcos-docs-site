---
layout: layout.pug
navigationTitle:  dcos job schedule remove
title: dcos job schedule remove
menuWeight: 7
excerpt: 删除作业时间表
enterprise: false
---


# 说明
`dcos job schedule remove` 命令让您删除作业时间表。

# 使用

```bash
dcos job schedule remove <job-id> <schedule-id>
```

# 选项

| 名称 | 说明 |
|---------|-------------|
|`-h`，`--help` | 打印用法。 |

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<job-id>` | 指定作业 ID。您可以使用 `dcos job list` 命令查看作业 ID。|
| `<schedule-id>` | 时间表 ID。 |



# 示例

## 删除作业

在本示例中，一个名为 `my-job` 的作业被删除。

```bash
dcos job remove my-job
```


# 父命令

| 命令 | 说明 |
|---------|-------------|
|  [dcos job](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-job/)  | 在 DC/OS 中部署和管理作业。|
