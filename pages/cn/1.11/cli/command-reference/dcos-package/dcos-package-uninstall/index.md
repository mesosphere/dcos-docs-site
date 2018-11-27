---
layout: layout.pug
navigationTitle: dcos package uninstall
title: dcos package uninstall
menuWeight: 7
excerpt: 卸载软件包

enterprise: false
---

# 说明
`dcos package uninstall` 命令让您卸载软件包。

# 使用

```bash
dcos package uninstall <package-name> [OPTION]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| `--all` | 所有软件包。|
| `--app` | 仅应用程序。|
| `--app-id=<app-id>` | 应用程序 ID。|
| `--cli` | 仅命令行。|

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<package-name>` | DC/OS 包的名称。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos package](/cn/1.11/cli/command-reference/dcos-package/) | 安装和管理 DC/OS 软件包。|

# 示例

有关示例，请参阅[文档](/cn/1.11/deploying-services/uninstall/)。
