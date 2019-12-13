---
layout: layout.pug
navigationTitle:  dcos security org service-accounts show
title: dcos security org service-accounts show
menuWeight: 180
excerpt: 显示服务帐户详情
enterprise: true
---

# 说明

`dcos security org service-accounts show` 命令显示由 SID 标识的服务帐户的详细信息。

# 使用

```
dcos security org service-accounts show [OPTIONS] [SIDS]...
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `-h`, `--help` | 显示此消息并退出。|
| `-j`, `--j` | JSON 格式的输出数据。|

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `SID` | 服务账户 ID。（必填）|
