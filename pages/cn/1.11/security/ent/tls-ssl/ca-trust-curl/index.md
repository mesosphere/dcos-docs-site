---
layout: layout.pug
navigationTitle: 在 curl 命令中建立信任
title: 在 curl 命令中建立信任
menuWeight: 400
excerpt: 在 curl 命令中建立信任

enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

如果您没有设置代理，您应该在 `permissive` 和 `strict` 安全模式下使用 `curl` 命令中 `--cacert dcos-ca.crt`。

**先决条件：**[DC/OS CA 根证书](/cn/1.11/security/ent/tls-ssl/get-cert/)的本地副本。

如果您没有[设置代理](/cn/1.11/security/ent/tls-ssl/haproxy-adminrouter/)，您应该在 `permissive` 和 `strict` 安全模式下使用 `curl` 命令中的 `--cacert dcos-ca.crt`。

在以下示例中，我们假定文件被命名 `dcos-ca.crt` 并位于当前目录中。

```bash
curl -X GET --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/users
```
