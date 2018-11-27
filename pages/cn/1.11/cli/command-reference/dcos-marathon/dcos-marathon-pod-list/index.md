---
layout: layout.pug
navigationTitle: dcos marathon pod list
title: dcos marathon pod list
menuWeight: 25
excerpt: 查看部署的 pod

enterprise: false
---

# 说明
`dcos marathon pod list` 命令显示已部署 pod 的列表。

# 使用

```bash
dcos marathon pod list [OPTION]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| `--config-schema` | 显示 Marathon 子命令的配置架构。|
| `--json` | 显示 JSON 格式的数据。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/cn/1.11/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|

# 示例

## 列出 pod
使用以下命令列出 pod 及其容器数：
```
dcos marathon pod list
```
