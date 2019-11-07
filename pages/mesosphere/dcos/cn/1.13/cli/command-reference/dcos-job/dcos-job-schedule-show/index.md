---
layout: layout.pug
navigationTitle:  dcos job schedule show
title: dcos job schedule show
menuWeight: 8
excerpt: 查看作业时间表
渲染：胡须
模型：/mesosphere/dcos/1.13/data.yml
enterprise: false
---

# 说明

`dcos job schedule show` 命令允许您查看作业时间表。

# 使用

```bash
dcos job schedule show <job-id> [--json]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
|`-h`，`--help` | 打印用法。 |
| `--json` | 打印 JSON 格式列表而不是表格。|


## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<job-id>` | 指定作业 ID。您可以使用 `dcos job list` 命令查看作业 ID。|



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
# 父命令

| 命令 | 说明 |
|---------|-------------|
|  [dcos job](/mesosphere/dcos/1.13/cli/command-reference/dcos-job/)  | 在 DC/OS 中部署和管理作业。|
