---
layout: layout.pug
navigationTitle:  dcos job show
title: dcos job show
menuWeight: 10
excerpt: 显示工作定义
enterprise: false
---


# 说明
`dcos job show` 命令显示作业定义。

# 使用

```bash
dcos job schedule show <job-id> [--json]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
|`-h`，`--help` | 打印用法。 |

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<job-id>` | 指定作业 ID。您可以使用 `dcos job list` 命令查看作业 ID。|


# 示例

## 显示作业定义

在本示例中，显示`my-scheduled-job`作业定义。

```bash
dcos job show my-scheduled-job
```

输出如下：

```bash
{
  "description": "A job that sleeps on a schedule",
  "id": "my-scheduled-job",
  "labels": {},
  "run": {
    "artifacts": [],
    "cmd": "sleep 20000",
    "cpus": 0.01,
    "disk": 0,
    "env": {},
    "maxLaunchDelaySeconds": 3600,
    "mem": 32,
    "placement": {
      "constraints": []
    },
    "restart": {
      "policy": "NEVER"
    },
    "volumes": []
  }
}
```
# 父命令

| 命令 | 说明 |
|---------|-------------|
|  [dcos job](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-job/)  | 在 DC/OS 中部署和管理作业。|
