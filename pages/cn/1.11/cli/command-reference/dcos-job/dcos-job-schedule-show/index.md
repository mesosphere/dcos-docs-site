---
layout: layout.pug
navigationTitle: dcos job schedule show
title: dcos job schedule show
menuWeight: 8
excerpt: 查看作业时间表

enterprise: false
---


# 说明
`dcos job schedule show` 命令让您查看作业时间表。

# 使用

```bash
dcos job schedule show <job-id> [OPTION]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| | `--json` | 打印以 JSON 为格式的列表。|

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<job-id>`   |  Specify the job ID.  You can view the job IDs with the `dcos job list` 命令。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
|  [dcos job](/cn/1.11/cli/command-reference/dcos-job/)  | 在 DC/OS 中部署和管理作业。|

# 示例

## 查看作业时间表

在本示例中，一个名为 `my-scheduled-job`的作业被查看。

```bash
dcos job schedule show my-scheduled-job
```

输出如下：

```bash
ID             CRON        ENABLED            NEXT RUN            CONCURRENCY POLICY  
sleep-nightly  20 0 * * *    True   2017-02-19T00:20:00.000+0000        ALLOW
```
