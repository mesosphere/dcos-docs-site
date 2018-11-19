---
layout: layout.pug
navigationTitle: 限制
excerpt: DC/OS Apache Kafka 服务的已知限制
title: 限制
menuWeight: 100
model: /cn/services/kafka/data.yml
render: mustache
---

#include /cn/services/include/limitations.tmpl
#include /cn/services/include/limitations-zones.tmpl
#include /cn/services/include/limitations-regions.tmpl

## Log Retention Bytes

`disk` 配置值以 MB 为单位。建议您设置的配置值 `log_retention_bytes` 小于指示 `disk` 配置。参阅 [配置](/services/kafka/2.3.0-1.1.0/configuration/) 部分，了解有关自定义这些值的指令。

## 安全

### {{ model.techShortName }} CLI

启用任何安全功能时，该 {{ model.techShortName }} 服务 CLI 子命令 `topic` 将不会运行。虽然服务 CLI 便利功能不会运行，但是与 [{{ model.techName }}] 绑定的工具(https://cwiki.apache.org/confluence/display/KAFKA/System+Tools) 以及支持启用安全模式的其他工具会运行。


### Kerberos

启用 Kerberos 时，broker VIP 被禁用，Kerberized 客户端将无法使用它。这是因为每个 {{ model.techShortName }} broker 都使用特定的 Kerberos principal，不能接受来自 VIP 所需的单个统一 principal 的连接。

### 切换 Kerberos

Kerberos 身份认证可以进行切换（启用/禁用），但这会触发集群的滚动重启。配置旧安全设置的客户端在此过程期间和之后会失去连接。我们建议您备份文件并安排停机时间。

### 切换传输加密

使用 TLS 的传输加密可以进行切换（启用/禁用），但这会触发集群的滚动重启。当每个 broker 重新启动时，基于其安全设置以及 `service.security.transport_encryption.allow_plaintext` 配置选项的值，客户端可能会断开连接。我们建议您备份文件并安排停机时间。

要启用 TLS，则需要服务帐户和相应的密码。由于无法更改服务使用的服务帐户，建议使用显式服务帐户部署服务，以允许 TLS 在后续阶段启用。
