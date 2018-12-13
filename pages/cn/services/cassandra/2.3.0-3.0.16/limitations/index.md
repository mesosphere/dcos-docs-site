---
layout: layout.pug
excerpt: 备份、节点计数、安全的限制。
title: 限制
navigationTitle: 限制
menuWeight: 100
model: /cn/services/cassandra/data.yml
render: mustache
---

#include /cn/services/include/limitations.tmpl
#include /cn/services/include/limitations-zones.tmpl
#include /cn/services/include/limitations-regions.tmpl

## 备份/恢复

该服务不支持使用在此或先前版本中启用的身份验证/授权执行备份和恢复。

## 节点计数

DC/OS {{ model.techName }} 服务必须至少部署 {{ model.minNodeCount }} 个节点。

## 安全

目前不支持 {{ model.techName }} 的本地身份验证和授权机制。

### 切换传输加密

使用 TLS 的传输加密可以进行切换（启用/禁用），但会触发集群的滚动重启。当每个节点重新启动时，基于其安全设置以及 `service.security.transport_encryption.allow_plaintext` 配置选项的值，客户端可能会断开连接。您应该进行备份和计划停机时间。

要启用 TLS，则需要服务帐户和相应的密钥。由于无法更改服务使用的服务帐户，建议使用显式服务帐户部署服务，以允许 TLS 在后续阶段启用。

## 数据中心名称

安装后无法更改数据中心的名称。{{ model.techName }} 安装后，`service.data_center` 和 `service.rack` 选项不能进行修改。

```
"service": {
...
        data_center": {
          "description": "The name of the data center this cluster is running in",
          "type": "string",
          "default": "datacenter1"
        },
        "rack": {
          "description": "The name of the rack this cluster is running on",
          "type": "string",
          "default": "rack1"
        },
...
}
```
