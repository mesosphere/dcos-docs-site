---
layout: layout.pug
navigationTitle:  dcos marathon group add
title: dcos marathon group add
menuWeight: 17
excerpt: 添加 Marathon 组
enterprise: false
---


# 说明

`dcos marathon group add` 命令让您可以添加 Marathon 组。

# 使用

```bash
dcos marathon group add [<group-resource>]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `-h`，`--help` | 显示有关此命令用法的信息。 |


## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<group-resource>` | 包含组的 JSON 定义的文件或 HTTP(S) URL 路径。如果省略，则从 `stdin` 中读取定义。有关详细说明，请参阅[文档](/mesosphere/dcos/cn/1.12/deploying-services/marathon-api/)。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos marathon](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-marathon/) | 将应用程序部署到 DC/OS 并对其进行管理。|

