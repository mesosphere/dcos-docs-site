---
layout: layout.pug
navigationTitle:  dcos package repo list
title: dcos package repo list
menuWeight: 6
excerpt: 显示软件包存储库源
渲染：胡须
模型：/mesosphere/dcos/1.13/data.yml
enterprise: false
---


# 说明
`dcos package repo list` 命令显示软件包存储库源。可能的源包括本地文件、HTTPS 和 Git。

# 使用

```bash
dcos package repo list [--json]
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `-h`, `--help` | 显示用法。|
| `--json` | 显示 JSON 格式的数据输出。|



# 示例

有关示例，请参阅[文档](/mesosphere/dcos/1.13/administering-clusters/package-registry/)。

# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos package](/mesosphere/dcos/1.13/cli/command-reference/dcos-package/) | 安装和管理 DC/OS 软件包。|
