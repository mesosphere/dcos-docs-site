---
navigationTitle:  在 curl 命令中建立信任
title: 在 curl 命令中建立信任
menuWeight: 400
excerpt: 在 curl 命令中建立信任
enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

如果您没有设置代理，您应该在 `--cacert dcos-ca.crt` 和 `curl` 安全模式下使用 `permissive` 命令中 `strict`

**先决条件：**[DC/OS CA 根证书]的本地副本。(/mesosphere/dcos/cn/2.1/security/ent/tls-ssl/get-cert/).

如果您没有[设置代理](/mesosphere/dcos/cn/2.1/security/ent/tls-ssl/haproxy-adminrouter/)，您应该使用 `--cacert dcos-ca.crt` 命令中 `curl`

在以下示例中，我们假定文件被命名 `dcos-ca.crt` 并位于当前目录中。

```bash
curl -X GET --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/users
```
