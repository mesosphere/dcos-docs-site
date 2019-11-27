---
layout: layout.pug
navigationTitle:  确保与 TLS 通信的安全
title: 确保与 TLS 通信的安全
menuWeight: 120
excerpt: 使用 TLS 证书确保加密通信的安全
enterprise: true
render: mustache
model: /mesosphere/dcos/1.13/data.yml
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


DC/OS 证书颁发机构 (CA) 签署 TLS 证书，并在 bootstrap 序列期间将其提供给 `systemd`-started 服务。这就完成了加密通信，无需手动干预。每个 DC/OS 群集都有自己的 DC/OS CA 和唯一的根证书。因为 DC/OS CA 不会出现在受信任证书颁发机构的任何列表中，来自群集外的请求，如来自浏览器或 `curl` 的请求，将导致警告消息。要建立与 DC/OS 群集的可信通信，并停止警告消息：

1. 获取 [DC/OS CA 捆绑包](/mesosphere/dcos/1.13/security/ent/tls-ssl/get-cert/)。

1. 执行以下操作之一：

     - 在[浏览器](/mesosphere/dcos/1.13/security/ent/tls-ssl/ca-trust-browser/)、[DC/OS CLI](/mesosphere/dcos/1.13/security/ent/tls-ssl/ca-trust-cli/)、[curl 命令](/mesosphere/dcos/1.13/security/ent/tls-ssl/ca-trust-curl/)和其他客户端中手动添加 DC/OS CA 作为受信任的机构。

     - 在 Admin Router 和来自群集外的用户代理程序请求之间[设置代理](/mesosphere/dcos/1.13/security/ent/tls-ssl/haproxy-adminrouter/)。
