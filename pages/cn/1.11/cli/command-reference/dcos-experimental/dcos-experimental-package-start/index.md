---
layout: layout.pug
navigationTitle: dcos experimental service start
title: dcos experimental service start
menuWeight: 3
excerpt: 从非本机 DC/OS 包启动服务

enterprise: false
---


# 说明
`dcos experimental service start` 命令让您从非本机 DC/OS 包启动服务。参见 [`dcos experimental package add`](cn/1.11/cli/command-reference/dcos-experimental/dcos-experimental-package-add/) 了解有关如何将您自己的软件包添加到 DC/OS 的信息。

# 使用

```bash
dcos experimental service start <package-name> [OPTION]
```

# 选项

| 名称，简写 | 说明 |
|---------|------------|
| | `--json` | 指定以 JSON 为格式的数据。|
| `--options=<options-file>` | 包含自定义包执行选项的 JSON 文件的路径。 |
| `--package-version=<package-version>` | 包版本。|

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<package-name>` | DC/OS 包的名称。| 

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos experimental](/cn/1.11/cli/command-reference/dcos-experimental/)  | 管理正在开发并可能发生变化的命令。| 
