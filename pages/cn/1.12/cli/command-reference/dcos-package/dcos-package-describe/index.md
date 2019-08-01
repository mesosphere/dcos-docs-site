---
layout: layout.pug
navigationTitle:  dcos package describe
title: dcos package describe
menuWeight: 0
excerpt: 获取软件包的详细信息
enterprise: false
---


# 说明
`dcos package describe` 命令让您可以查看软件包的特定详细信息。

# 使用

```bash
dcos package describe <package-name> --package-versions
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `-h`, `--help` | 显示用法。 |
| `--package-versions` | 显示该软件包的所有版本。|


## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<package-name>` | DC/OS 包的名称。|

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos package](/mesosphere/dcos/cn/1.12/cli/command-reference/dcos-package/) | 安装和管理 DC/OS 软件包。|
