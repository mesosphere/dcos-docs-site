---
layout: layout.pug
navigationTitle:  dcos job show runs
title: dcos job show runs
menuWeight: 11
excerpt: 显示作业运行状态

enterprise: false
---


# 说明
`dcos job show runs` 命令显示作业运行的成功和故障状态。

# 使用

```bash
dcos job show runs <job-id> [--run-id <run-id>][--json|--quiet]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
|`-h`，`--help` | 打印用法。 |
| | `--json` | 显示 JSON 格式的列表。|
| `-q`，`--quiet` | 表示仅输出运行 ID 阵列的静默模式。 |

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<job-id>` | 指定作业 ID。|
| `--run-id <run-id>` | 作业运行的 ID。您可以使用 `dcos job list` 命令查看作业 ID。|



# 示例

## 显示运行状态

在此示例中，显示作业成功运行。

```bash
dcos job show runs my-scheduled-job
```

输出如下：

```bash
JOB ID            ID                            STARTED AT
my-scheduled-job  20170218001959YVKlq  2017-02-18T00:19:59.417+0000
my-scheduled-job  20170217230705AfpRn  2017-02-17T23:07:05.218+0000
```

# 父命令

| 命令 | 说明 |
|---------|-------------|
|  [dcos job](/cn/1.12/cli/command-reference/dcos-job/)  | 在 DC/OS 中部署和管理作业。|
