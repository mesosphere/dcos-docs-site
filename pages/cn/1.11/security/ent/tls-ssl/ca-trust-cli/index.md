---
layout: layout.pug
navigationTitle: 在 CLI 中建立信任
title: 在 CLI 中建立信任
menuWeight: 300
excerpt: 在 CLI 中建立信任
enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

 默认情况下，DC/OS CLI 不验证 TLS 证书的签名者。我们建议完成以下简短步骤，以确保 DC/OS CLI 仅信赖您的 DC/OS CA，并拒绝与其他方的连接。

**注意：**如果您已[设置代理](/cn/1.11/security/ent/tls-ssl/haproxy-adminrouter/)，则不需要该程序。

默认情况下，DC/OS CLI 不验证 TLS 证书的签名者。我们建议完成以下简短步骤，以确保 DC/OS CLI 仅信赖您的 DC/OS CA，并拒绝与其他方的连接。

**先决条件：**[DC/OS CA 根证书](/cn/1.11/security/ent/tls-ssl/get-cert/)的本地副本。

1. 使用以下命令更改默认值，并设置 DC/OS CLI 以信任您的 DC/OS CA。

   ```bash
   dcos config set core.ssl_verify $(pwd)/dcos-ca.crt
   ```

1. 您应收到以下消息，表示成功。

   ```bash
   [core.ssl_verify]: changed from 'False' to '/path/dcos-ca.crt'
   ```
