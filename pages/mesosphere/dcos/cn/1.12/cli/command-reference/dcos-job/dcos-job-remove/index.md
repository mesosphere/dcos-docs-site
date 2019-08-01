---
layout: layout.pug
navigationTitle:  dcos job remove
title: dcos job remove
menuWeight: 4
excerpt: 删除作业
enterprise: false
---


# 说明

`dcos job remove` 命令让您删除作业。

# 使用

```bash
dcos job remove <job-id> [--stop-current-job-runs]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--stop-current-job-runs` | 在删除作业时表示应该终止当前运行的所有作业。 |
|`-h`，`--help` | 打印用法。 |

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<job-id>` | 指定作业 ID。您可以使用 `dcos job list` 命令查看作业 ID。 |



# 示例

## 删除作业

在本示例中，带有 ID `my-job` 的作业被删除。

```bash
dcos job remove my-job
```

# 父命令

| 命令 | 说明 |
|---------|-------------|
|  [dcos job](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-job/)  | 在 DC/OS 中部署和管理作业。|
