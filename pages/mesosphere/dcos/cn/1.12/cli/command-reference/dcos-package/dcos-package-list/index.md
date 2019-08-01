---
layout: layout.pug
navigationTitle:  dcos package list
title: dcos package list
menuWeight: 2
excerpt: 显示已安装的 DC/OS 软件包列表
enterprise: false
---


# 说明
`dcos package list` 命令显示已安装的 DC/OS 软件包列表。

# 使用

```bash
dcos package list [<package-name> --json --app-id=<app-id> --cli]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `-h`, `--help` | 显示用法。|
| `--app-id=<app-id>` | 应用程序 ID。|
| `--cli` | 仅命令行。|
| `--json` | JSON 格式的数据。|

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<package-name>` | DC/OS 包的名称。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos package](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-package/) | 安装和管理 DC/OS 软件包。|

# 示例

有关示例，请参阅[文档](/mesosphere/dcos/cn/1.12/deploying-services/install/)。
