---
layout: layout.pug
navigationTitle:  dcos package search
title: dcos package search
menuWeight: 6
excerpt: 搜索软件包存储库
render: mustache
model: /mesosphere/dcos/1.13/data.yml
enterprise: false
---

# 说明
`dcos package search` 命令允许您搜索软件包存储库。

# 使用

```bash
dcos package search [<query> --json]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `-h`, `--help` | 显示用法。|
| `--json` | 将输出显示为 JSON 格式的数据。 |

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<query>` | 用于搜索软件包存储库的模式。您可以使用完整值或部分值。|



# 示例

有关示例，请参阅[文档](/mesosphere/dcos/1.13/administering-clusters/package-registry/)。

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos package](/mesosphere/dcos/cn/1.13/cli/command-reference/dcos-package/) | 安装和管理 DC/OS 软件包。|
