---
layout: layout.pug
navigationTitle:  dcos marathon debug list
title: dcos marathon debug list
menuWeight: 12
excerpt: 显示 Marathon 应用程序部署的当前队列
enterprise: false
---



# 说明
`dcos marathon debug list` 命令让您显示当前队列实例启动列表，用于调试。

# 使用

```bash
dcos marathon debug list [--json]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `-h`，`--help` | 显示有关此命令用法的信息。 |
| `--json` | 显示 JSON 格式的数据。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/cn/1.12/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|

