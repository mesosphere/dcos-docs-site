---
layout: layout.pug
navigationTitle:  dcos task download
title: dcos task download
menuWeight: 2
excerpt: 从 Mesos 任务沙盒目录下载文件

enterprise: false
---

# 说明
`dcos task download` 命令可从 Mesos 任务沙盒目录下载文件。

# 使用

```bash
dcos task download <task> [<path>] [OPTION]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| `--target-dir`   | 指定下载的目标目录。默认为当前工作目录 (`$PWD`)。 |


# 位置自变量

| Name<>shorthand | Default | Description |
|---------|-------------|-------------|
| `<task>`   |             | 指定完整任务 ID、部分任务 ID 或 UNIX Shell 通配符模式（如 `my-task*`）。 |
| `<path>`   |     `/`      | 指定文件或目录中的 Mesos 沙盒目录路径。您还可以使用 UNIX Shell 通配符模式来指定路径（例如，`/std*`)|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos task](/mesosphere/dcos/2.0/cli/command-reference/dcos-task/)   | 管理 DC/OS 任务。 |
