---
layout: layout.pug
navigationTitle:  dcos marathon pod add
title: dcos marathon pod add
menuWeight: 23
excerpt: 添加 pod
enterprise: false
---


# 说明
<<<<<<< HEAD
`dcos marathon pod add` 命令让您可以添加 pod。
=======
`dcos marathon pod add` 命令允许您添加 pod。
>>>>>>> staging

# 使用

```bash
dcos marathon pod add [<pod-resource>]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `-h`，`--help` | 显示有关此命令用法的信息。 |

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
<<<<<<< HEAD
| `<pod-resource>` | 包含 pod 的 JSON 定义的文件或 HTTP(S) URL 路径。如果省略，则从 stdin 中读取定义。|
=======
| `<pod-resource>` | 包含 pod 的 JSON 定义的文件或 HTTP(S) URL 路径。如果遗漏，则从 stdin 中读取定义。|
>>>>>>> staging


# 示例

## 添加 Pod

若要添加 pod，首先创建 JSON pod 定义。然后运行以下命令：
```
dcos marathon pod add <pod-json-file>
```

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/cn/1.12/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|