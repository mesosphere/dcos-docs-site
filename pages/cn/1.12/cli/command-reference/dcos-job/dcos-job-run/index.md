---
layout: layout.pug
navigationTitle:  dcos job run
title: dcos job run
menuWeight: 5
excerpt: 运行 DC/OS 作业
enterprise: false
---



# 说明
`dcos job run` 命令让您立即运行作业。

# 使用

```bash
dcos job run <job-id> [--json]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
|`-h`，`--help` | 打印用法。 |
| `--json` | 打印 JSON 格式的列表而不是表格。 |


## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<job-id>` | 指定作业 ID。您可以使用 `dcos job list` 命令查看作业 ID。|


# 示例

## 运行作业

在此示例中，您可以运行名为 `my-job`的作业。

```bash
dcos job run my-job
```

# 父命令

| 命令 | 说明 |
|---------|-------------|
|  [dcos job](/cn/1.12/cli/command-reference/dcos-job/)  | 在 DC/OS 中部署和管理作业。|