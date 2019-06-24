---
layout: layout.pug
navigationTitle:  dcos package search
title: dcos package search
menuWeight: 6
excerpt: 搜索软件包存储库
enterprise: false
---

# 说明
`dcos package search` 命令让您可以搜索软件包存储库。

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

有关示例，请参阅[文档](/cn/1.12/administering-clusters/repo/)。

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos package](/cn/1.12/cli/command-reference/dcos-package/) | 安装和管理 DC/OS 软件包。|