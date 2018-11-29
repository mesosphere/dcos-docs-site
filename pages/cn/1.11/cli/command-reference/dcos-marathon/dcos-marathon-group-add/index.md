---
layout: layout.pug
navigationTitle: dcos marathon group add
title: dcos marathon group add
menuWeight: 17
excerpt: 添加 Marathon 组

enterprise: false
---


# 说明
`dcos marathon group add` 命令让您添加 Marathon 组。

# 使用

```bash
dcos marathon group add <group-resource> [OPTION]
```

# 选项

无。

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<group-resource>`   | Path to a file or HTTP(S) URL that contains the group's JSON definition. If omitted, the definition is read from `stdin`。有关详细说明，请参阅[文档](/cn/1.11/deploying-services/marathon-api/)。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/cn/1.11/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|

