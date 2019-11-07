---
layout: layout.pug
navigationTitle:  dcos security org service-accounts delete
title: dcos security org service-accounts delete
menuWeight: 170
excerpt: 删除服务帐户
render: mustache
model：/mesosphere/dcos/2.0/data.yml
enterprise: true
---

# 说明

`dcos security org service-accounts delete` 命令允许您删除由服务帐户 ID (SID) 标识的服务帐户。

# 使用

```
dcos security org service-accounts delete [OPTIONS] SID
```

# 选项

| 名称 | 说明 |
|---------|-------------|
| `-h`, `--help`| 显示此消息并退出。|

## 位置自变量

| 名称 | 说明 |
|---------|-------------|
| `SID` | 服务账户 ID。（必填）|
