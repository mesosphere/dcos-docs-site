---
layout: layout.pug
navigationTitle:  dcos package repo import
title: dcos package repo import
menuWeight: 4
excerpt: 将软件包存储库添加到 DC/OS
enterprise: false
---

# 说明

`dcos package repo import` 命令让您可以导入包含带有 `<repo-file>` 标识的软件包存储库的文件。

# 使用

```
dcos package repo import <repos-file>
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `-h`, `--help` | 显示用法。|

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<repo-file>` | 包含软件包存储库的文件，列出的格式为 `dcos package list --json`。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos package](/cn/1.12/cli/command-reference/dcos-package/) | 安装和管理 DC/OS 软件包。|