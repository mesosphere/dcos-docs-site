---
layout: layout.pug
navigationTitle:  dcos security cluster ca profile
title: dcos security cluster ca profile
menuWeight: 15
excerpt: 管理 DC/OS 证书颁发机构
enterprise: true
---

# 说明

`dcos security cluster ca profile` 命令显示有关签名配置文件的信息。如果未指定配置文件名称或给定配置文件不存在，则返回默认配置文件信息。


# 使用

```
dcos security cluster ca profile [OPTIONS]
```

# 选项

| 名称 | 说明 |
|-------|------------|
| `-p`, `--profile <text>`| 要获取相关信息的签名配置文件。|
| `-j`, `--json` | JSON 格式的输出数据。|
| `-h`, `--help` | 显示此消息并退出。|


# 父命令

| 命令 | 说明 |
|---------|-------------|
| [DCOS 安全群集 CA](/cn/1.12/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-ca/) | 查看 DC/OS 安全群集证书颁发机构信息。 |
