---
layout: layout.pug
navigationTitle: dcos experimental package build
title: dcos experimental package build
menuWeight: 2
excerpt: 构建本地包
enterprise: false
---


# 说明
`dcos experimental package build` 命令让您在本地构建要添加到 DC/OS 或与 DC/OS Universe 共享的软件包。

# 使用

```bash
dcos experimental package build <build-definition> [OPTION]
```

# 选项

| Name<>shorthand | Default | Description |
|---------|-------------|-------------|
| | `--json` | | 指定以 JSON 为格式的数据。|
| `--output-directory=<output-directory>` | 当前工作目录 | 要存储数据的目录的路径。|

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<build-definition>` | DC/OS 包构建定义的路径。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos experimental](/cn/1.11/cli/command-reference/dcos-experimental/)  | 管理正在开发并可能发生变化的命令。| 
