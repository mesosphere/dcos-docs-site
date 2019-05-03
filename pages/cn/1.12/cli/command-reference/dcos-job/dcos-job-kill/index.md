---
layout: layout.pug
navigationTitle:  dcos job kill
title: dcos job kill
menuWeight: 2
excerpt: 结束 DC/OS 作业
enterprise: false
---


# 说明
`dcos job kill` 命令允许您终止指定的作业。

# 使用

```bash
dcos job kill <job-id> (<run-id>|--all)
```

# 选项

| 名称 | 说明 |
|---------|-------------|
|`-h`，`--help` | 打印用法。 |
| `--all` | 表示应该终止所有运行而不是指定一个要终止的 `run_id`。|


## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `run-id` | 作业运行的运行 ID。 |
| `job-id` | 作业 ID。 |


# 父命令

| 命令 | 说明 |
|---------|-------------|
|  [dcos job](/cn/1.12/cli/command-reference/dcos-job/)  | 在 DC/OS 中部署和管理作业。|
