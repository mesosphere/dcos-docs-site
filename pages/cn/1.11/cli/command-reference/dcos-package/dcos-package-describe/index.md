---
layout: layout.pug
navigationTitle: dcos package describe
title: dcos package describe
menuWeight: 0
excerpt: 获取软件包的详细信息

enterprise: false
---


# 说明
`dcos package describe` 命令让您查看软件包的特定详细信息。

# 使用

```bash
dcos package describe <package-name> [OPTION]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| `--app` | 仅应用程序。|
| `--cli` | 仅命令行。|
| `--config` | 显示 `marathon.json` 文件的可配置属性。|
| `--options=<file>` | 包含自定义软件包安装选项的 JSON 文件路径。|
| `--package-versions` | 显示该软件包的所有版本。|
| `--package-version=<package-version>` | 包版本。|
| `--render` | 使用 `config.json` 和 `--options` 中的值整理 `marathon.json` 软件包模板。如果未提供，则显示原始模板。|

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<package-name>` | DC/OS 包的名称。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos package](/cn/1.11/cli/command-reference/dcos-package/) | 安装和管理 DC/OS 软件包。|
