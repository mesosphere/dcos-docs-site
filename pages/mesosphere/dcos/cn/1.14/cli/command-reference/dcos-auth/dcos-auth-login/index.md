---
layout: layout.pug
navigationTitle:  dcos auth login
title: dcos auth login
menuWeight: 2
excerpt: 登录到 DC/OS 群集
enterprise: false
渲染：胡须
型号：/mesosphere/dcos/1.14/data.yml
---

# 说明

`dcos auth login` 命令允许您登录当前群集。

# 使用

```bash
dcos auth login [flags]
```

# 选项

| 名称 | 说明 |
|---------|-------------|-------------|
| | `--help, h` | 显示使用情况。|
| `--password string` | 在命令行中指定密码（不安全）。|
| `--password-file string` | 指定包含密码的文件的路径。|
| `--private-key string` | 指定包含服务帐户私钥的文件的路径。 |
| `--provider string` | 指定要使用的登录提供商。|
| `--username string` | 指定登录用户名。 |
|


# 父命令

| 命令 | 说明 |
|---------|-------------|
| [dcos auth](/mesosphere/dcos/1.14/cli/command-reference/dcos-auth/) | 管理 DC/OS 身份和访问。 |
