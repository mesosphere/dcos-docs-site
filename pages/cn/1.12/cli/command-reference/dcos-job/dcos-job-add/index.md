---
layout: layout.pug
navigationTitle:  dcos job add
title: dcos job add
menuWeight: 0
excerpt: 添加工作
enterprise: false
---

# 说明

`dcos job add` 命令让您可以从 JSON 格式配置文件中添加作业。

# 使用

```bash
dcos job add <job-file>
```
# 选项

| 名称 | 说明 |
|---------|-------------|
|`-h`，`--help` | 打印用法。 |

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<job-file>` | 指定 JSON 格式的作业定义。|



# 示例

有关作业示例，请参阅[创建作业](/cn/1.12/deploying-jobs/examples/#create-job)。

有关如何使用此命令创建作业的信息，请参阅 [添加作业](/cn/1.12/deploying-jobs/quickstart/#add-a-job-2)。

# 父命令

| 命令 | 说明 |
|---------|-------------|
|  [dcos job](/cn/1.12/cli/command-reference/dcos-job/)  | 在 DC/OS 中部署和管理作业。|