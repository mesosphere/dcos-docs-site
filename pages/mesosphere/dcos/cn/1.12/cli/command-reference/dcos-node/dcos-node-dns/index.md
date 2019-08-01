---
layout: layout.pug
navigationTitle:  dcos node dns
title: dcos node dns
menuWeight: 6
excerpt: 查看 DC/OS 节点信息
enterprise: false
---

# 说明

`dcos node dns` 命令让您可以查看您的 DC/OS 群集的域名服务配置。

# 使用

```
dcos node dns <dns-name> [--json]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `--help, h` | 显示用法。 |
| `--json` | 显示 JSON 格式的数据。|

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<dns-name>` | DNS 服务名称。|


# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos 节点](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-node/) | 查看 DC/OS 节点信息。|

