---
layout: layout.pug
navigationTitle: dcos marathon pod show
title: dcos marathon pod show
menuWeight: 27
excerpt: 显示特定 pod 的详细信息

enterprise: false
---


# 说明
`dcos marathon pod show` 命令让您查看特定 pod 的详细信息。

# 使用

```bash
dcos marathon pod show <pod-id> [OPTION]
```

# 选项

无。

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<pod-id>`   | The pod ID. You can view a list of the pod IDs with the `dcos marathon pod list` 命令。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/cn/1.11/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|

# 示例

## 显示 Pod JSON
要查看 pod 定义，请运行以下命令：
```
dcos marathon pod show <pod-id>
```
您可使用 `show` 命令以编程方式读取有关 pod 的数据。
