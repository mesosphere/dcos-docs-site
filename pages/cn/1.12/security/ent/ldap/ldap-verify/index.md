---
layout: layout.pug
navigationTitle: 验证 
title: 验证 
menuWeight: 3
excerpt: 验证与 LDAP 服务器的连接
enterprise: true
---

<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

在本部分中，您将验证您提供的参数是否允许 DC/OS 连接到 LDAP 服务器。

1. 单击 **Test Connection** 以验证您的连接。

1. 在 **LDAP Username** 字段中输入外部 LDAP 目录中用户的用户 ID。`%(username)s` 字符串将被替换为您提供的用户 ID。

    若要尽可能接近地模拟实际登录，我们建议使用查找用户以外的用户凭据。

1. 在 **LDAP Password** 字段中键入用户的密码。

1. 单击 **Test Connection**。

1. 您应该看以下消息：`Connection with LDAP server was successful!`如果测试失败，请阅读错误消息以确定并解决问题。
