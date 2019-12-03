---
layout: layout.pug
navigationTitle:  dcos package uninstall
title: dcos package uninstall
menuWeight: 7
render: mustache
model: /mesosphere/dcos/1.13/data.yml
excerpt: 卸载软件包
enterprise: false
---

# 说明
`dcos package uninstall` 命令允许您卸载软件包。

# 使用

```bash
dcos package uninstall <package-name> [--cli | [--app [--app-id=<app-id> | --all] --yes]]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `-h`, `--help` | 显示用法。|
| `--all` | 所有应用程序。 |
| `--app` | 仅应用程序。|
| `--app-id=<app-id>` | 应用程序 ID。|
| `--cli` | 仅命令行。|
| `--yes` | 禁用交互模式并假设“是”是所有提示的答案。|

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<package-name>` | DC/OS 包的名称。|


# 示例

有关示例，请参阅[文档](/mesosphere/dcos/1.13/deploying-services/uninstall/)。


# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos package](/mesosphere/dcos/cn/1.13/cli/command-reference/dcos-package/) | 安装和管理 DC/OS 软件包。|
