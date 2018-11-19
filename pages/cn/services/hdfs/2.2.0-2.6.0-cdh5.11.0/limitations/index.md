---
layout: layout.pug
navigationTitle: 限制
excerpt: HDFS 服务的限制
title: 限制
menuWeight: 100
model: /cn/services/hdfs/data.yml
render: mustache
---

#include /cn/services/include/limitations.tmpl
#include /cn/services/include/limitations-zones.tmpl
#include /cn/services/include/limitations-regions.tmpl

## 安全

### 切换 Kerberos

无法切换 Kerberos 身份认证（启用/禁用）。为启用或禁用 Kerberos，服务必须卸载并按所需配置重新安装。

### 切换传输加密

传输加密 (TLS) 无法切换（启用/禁用）。为启用或禁用 TLS，服务必须卸载并按所需配置重新安装。
