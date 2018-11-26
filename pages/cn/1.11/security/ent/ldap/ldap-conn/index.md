---
layout: layout.pug
navigationTitle: 配置 
title: 配置 
menuWeight: 1
excerpt: 配置与 LDAP 服务器的连接 
enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

在本部分中，您将指定用于连接到 LDAP 服务器的地址、协议和证书。

1. 单击 **Settings** -> **LDAP Directory** 选项卡。

1. 单击 **Add Directory**。

 ![添加目录对话框](/cn/1.11/img/ldap-add-dir-conn.png)

 图 1. 添加目录对话框

1. 在 **Host** 框中键入 LDAP 目录服务器的主机名或 IP 地址。不要包含协议前缀或端口号。

1. 键入要在 **Port** 框中使用的 TCP/IP 端口号。端口 `389` 通常用于 StartTLS 和未加密通信。端口 `636` 通常用于 LDAPS 连接。

1. 从 **Select SSL/TLS setting** 列表框中选择首选加密选项。

 * 选择 **Use SSL/TLS for all connections** 复选框以使用 [安全 LDAP (LDAPS)](http://social.technet.microsoft.com/wiki/contents/articles/2980.ldap-over-ssl-ldaps-certificate.aspx)。

 * 选择 **尝试 StartTLS，如果未能**尝试通过 [StartTLS](https://tools.ietf.org/html/rfc2830) 将连接升级到 TLS，则中止，如果升级到 TLS 失败，则中止连接。

 * 选择**尝试 StartTLS，如果未能**尝试通过 [StartTLS](https://tools.ietf.org/html/rfc2830) 将连接升级到 TLS，则继续不加密，如果升级到 TLS 失败，则继续不加密连接。

 **注意：**我们建议**对所有连接使用 SSL/TLS**，否则 **尝试 StartTLS，如果无法**确保 SSL/TLS 或 StartTLS 加密，则中止；否则密码将以明文形式发送。

1. 如果 LDAP 目录服务器要求 DC/OS 提供[客户端证书](https://tools.ietf.org/html/rfc5246#section-7.4.6)，请将其粘贴到 **Client certificate and private key (Optional)** 字段。值应类似于以下内容。

    ```
    -----BEGIN PRIVATE KEY-----
 MIIDtDCcapy.. 
    -----END PRIVATE KEY-----
    -----BEGIN CERTIFICATE-----
 OIymBpp.. 
    -----END CERTIFICATE-----
    ```

1. 要确保 DC/OS 集群不接受来自指定 LDAP 目录服务器以外的其他方的连接，请将 LDAP 目录服务器的根 CA 证书和任何中间证书粘贴到 **CA certificate chain (Optional)** 字段中。我们强烈建议您完成此步骤，以便与 LDAP 目录服务器建立安全通信信道。

1. 指定身份认证方法和参数，如[身份认证部分]中所述(/1.11/security/ent/ldap/ldap-auth/)。
