---
layout: layout.pug
navigationTitle:  Establishing trust in your curl commands
title: Establishing trust in your curl commands
menuWeight: 400
excerpt: Establishing trust in your curl commands

enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->

If you have not set up a proxy, you should use `--cacert dcos-ca.crt` in your `curl` commands in `permissive` and `strict` security modes.

**Prerequisite:** A local copy of the [root certificate of your DC/OS CA](/1.13/security/ent/tls-ssl/get-cert/).

If you have not [set up a proxy](/1.13/security/ent/tls-ssl/haproxy-adminrouter/), you should use `--cacert dcos-ca.crt` in your `curl` commands.

In the following example, we assume that the file is named `dcos-ca.crt` and located in the current directory.

```bash
curl -X GET --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/users
```
