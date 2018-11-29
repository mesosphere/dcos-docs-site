---
layout: layout.pug
navigationTitle: dcos experimental package add
title: dcos experimental package add
menuWeight: 1
excerpt: 向 DC/OS 添加 DC/OS 包

enterprise: false
---


# 说明
`dcos experimental package add` 命令让您将 DC/OS 包添加到 DC/OS。

# 使用

```bash
dcos experimental package add [OPTION]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| `--dcos-package=<dcos-package>` | DC/OS 包的路径。|
| | `--json` | 指定以 JSON 为格式的数据。|
| `--package-name=<package-name>` | DC/OS 包的名称。|
| `--package-version=<package-version>` | 包版本。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos experimental](/cn/1.11/cli/command-reference/dcos-experimental/)  | 管理正在开发并可能发生变化的命令。| 
