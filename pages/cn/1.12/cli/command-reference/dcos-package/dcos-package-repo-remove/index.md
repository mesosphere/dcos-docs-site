---
layout: layout.pug
navigationTitle:  dcos package repo remove
title: dcos package repo remove
menuWeight: 9
excerpt: 从 DC/OS 中删除软件包存储库

enterprise: false
---


# 说明
`dcos package repo remove` 命令让您可以从 DC/OS 中删除软件包存储库。

# 使用

```bash
dcos package repo remove <repo-names>...
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `-h`, `--help` | 显示用法。|

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `<repo-name>` | 软件包存储库的名称。例如， `Universe`。|



# 示例

有关示例，请参阅[文档](/cn/1.12/administering-clusters/repo/)。

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos package](/cn/1.12/cli/command-reference/dcos-package/) | 安装和管理 DC/OS 软件包。|