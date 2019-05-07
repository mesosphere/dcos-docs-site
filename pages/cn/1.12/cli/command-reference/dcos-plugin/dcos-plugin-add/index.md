---
layout: layout.pug
navigationTitle:  dcos plugin add
title: dcos plugin add
menuWeight: 1
excerpt: 添加 CLI 插件
enterprise: false
---


# 说明

`dcos plugin add` 命令让您可以添加 CLI 插件。

# 使用

```bash
dcos plugin add <resource> [flags]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--update`, `-u` | 插件版本。 |
|  `--help, h` | 打印使用。|

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<resource>` | 插件资源路径。这可以是 `.zip` 文件或 URL |

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [DCOS 插件](/cn/1.12/cli/command-reference/dcos-plugin/) | 安装和管理 DC/OS 软件插件。 |
