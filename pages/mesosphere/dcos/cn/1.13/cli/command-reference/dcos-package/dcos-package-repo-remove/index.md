---
layout: layout.pug
navigationTitle:  dcos package repo remove
title: dcos package repo remove
menuWeight: 9
excerpt: 从 DC/OS 中删除软件包存储库
渲染：胡须
模型：/mesosphere/dcos/1.13/data.yml
enterprise: false
---


# 说明
`dcos package repo remove` 命令允许您从 DC/OS 中删除软件包存储库。

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
| `<repo-name>` | 软件包存储库的名称。例如， `{{ model.packageRepo }}`。|



# 示例

有关示例，请参阅[文档](/mesosphere/dcos/1.13/administering-clusters/package-registry/)。

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos package](/mesosphere/dcos/1.13/cli/command-reference/dcos-package/) | 安装和管理 DC/OS 软件包。|
