---
layout: layout.pug
navigationTitle: dcos marathon pod remove
title: dcos marathon pod remove
menuWeight: 26
excerpt: 删除 pod 

enterprise: false
---


# 说明
`dcos marathon pod remove` 命令让您删除 pod。

# 使用

```bash
dcos marathon pod remove <pod-id> [OPTION]
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

## 删除 Pod
使用以下命令删除 pod：
```
dcos marathon pod remove <pod-id>
```

如果当前 pod 正在部署，您将无法删除该 pod。若仍然要删除 pod，请使用 `--force` 标记运行该命令。
