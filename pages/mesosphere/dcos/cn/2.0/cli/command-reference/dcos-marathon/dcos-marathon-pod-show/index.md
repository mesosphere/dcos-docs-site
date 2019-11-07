---
layout: layout.pug
navigationTitle:  dcos marathon pod show
title: dcos marathon pod show
menuWeight: 27
excerpt: 显示特定 pod 的详细信息
enterprise: false
render: mustache
model：/mesosphere/dcos/2.0/data.yml
---


# 说明
`dcos marathon pod show` 命令允许您查看特定 pod 的详细信息。

# 使用

```bash
dcos marathon pod show <pod-id>
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `-h`，`--help` | 显示有关此命令用法的信息。 |

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<pod-id>` | POD ID。您可以使用 `dcos marathon pod list` 命令查看 pod ID 列表。|



# 示例

## 显示 Pod JSON
要查看 pod 定义，请运行以下命令：
```
dcos marathon pod show <pod-id>
```
您可使用 `show` 命令以编程方式读取有关 pod 的数据。

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/mesosphere/dcos/2.0/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|
