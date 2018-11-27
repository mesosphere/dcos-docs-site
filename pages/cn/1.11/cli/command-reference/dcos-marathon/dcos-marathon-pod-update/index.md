---
layout: layout.pug
navigationTitle: dcos marathon pod update
title: dcos marathon pod update
menuWeight: 28
excerpt: 更新 Marathon pod

enterprise: false
---


# 说明
`dcos marathon pod update` 命令让您更新 pod。

# 使用

```bash
dcos marathon pod update <pod-id> [OPTION]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| `--force` | 在更新期间禁用 Marathon 中的检查。|

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<pod-id>`   |  The pod ID. You can view a list of the pod IDs with the `dcos marathon pod list` 命令。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/cn/1.11/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|

# 示例

## 更新 Pod
若要更新 pod，首先修改 pod 的 JSON 定义，然后运行以下命令:

```
dcos marathon pod update <pod-id> < <new-pod-definition>
```

如果当前 pod 正在部署，您将无法更新该 pod。若仍然要更新 pod，请使用 `--force` 标记运行该命令。
