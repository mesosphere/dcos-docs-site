---
layout: layout.pug
navigationTitle:  dcos marathon pod remove
title: dcos marathon pod remove
menuWeight: 26
excerpt: 删除 pod
渲染：胡须
型号：/mesosphere/dcos/1.14/data.yml
enterprise: false
---


# 说明
`dcos marathon pod remove` 命令允许您删除 pod。

# 使用

```bash
dcos marathon pod remove [--force] <pod-id>
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--force` | 在更新期间禁用 Marathon 中的检查。|
| `-h`，`--help` | 显示有关此命令用法的信息。 |

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<pod-id>` | POD ID。您可以使用 `dcos marathon pod list` 命令查看 pod ID 列表。|



# 示例

## 删除 Pod
使用以下命令删除 pod：
```
dcos marathon pod remove <pod-id>
```

如果当前 pod 正在部署，您将无法删除该 pod。若仍然要删除 pod，请使用 `--force` 标记运行该命令。

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/mesosphere/dcos/1.14/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|
