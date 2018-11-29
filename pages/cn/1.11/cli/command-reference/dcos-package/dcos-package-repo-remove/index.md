---
layout: layout.pug
navigationTitle: dcos package repo remove
title: dcos package repo remove
menuWeight: 5
excerpt: 从 DC/OS 中删除软件包存储库

enterprise: false
---


# 说明
`dcos package repo remove` 命令让您从 DC/OS 中删除软件包存储库。

# 使用

```bash
dcos package repo remove <repo-name> [OPTION]
```

# 选项

| 名称，简写 | 说明 |
|---------|-------------|
| `<repo-name>`   |   Name of the package repository. For example, `Universe`. |

# 位置自变量

| 名称，简写 | 说明 |
|---------|-------------|
| `<repo-name>`   |   Name of the package repository. For example, `Universe`. |

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos package](/cn/1.11/cli/command-reference/dcos-package/) | 安装和管理 DC/OS 软件包。|

# 示例

有关示例，请参阅[文档](/cn/1.11/administering-clusters/repo/)。
