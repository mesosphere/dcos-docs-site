---
layout: layout.pug
navigationTitle: dcos package install
title: dcos package install
menuWeight: 1
excerpt: 安装软件包

enterprise: false
---


# 说明
`dcos package install` 命令让您安装软件包。

# 使用

```bash
dcos package install <package-name> [OPTION]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| `--app` | 仅应用程序。|
| `--app-id=<app-id>` | 应用程序 ID。|
| `--cli` | 仅命令行。|
| `--options=<file>` | 包含自定义软件包安装选项的 JSON 文件路径。|
| `--package-version=<package-version>` | 软件包版本。|
| | `--yes` | 禁用交互模式并假设“是”是所有提示的答案。|

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<package-name>` | DC/OS 包的名称。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos package](/cn/1.11/cli/command-reference/dcos-package/) | 安装和管理 DC/OS 软件包。|

# 示例

有关示例，请参阅[文档](/cn/1.11/deploying-services/config-universe-service/)。
