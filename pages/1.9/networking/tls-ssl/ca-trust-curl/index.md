---
layout: layout.pug
navigationTitle:  Establishing trust in your curl commands
title: Establishing trust in your curl commands
menuWeight: 400
excerpt: >
  If you have not set up a proxy, you
  should use `--cacert dcos-ca.crt` in
  your curl commands in `permissive` and
  `strict` security modes.
preview: true
enterprise: true
---

**Prerequisite:** A local copy of the [root certificate of your DC/OS CA](/1.9/networking/tls-ssl/get-cert/).

If you have not [set up a proxy](/1.9/networking/tls-ssl/haproxy-adminrouter/), you should use `--cacert dcos-ca.crt` in your curl commands in `permissive` and `strict` security modes. 

An example follows which assumes that the file is named `dcos-ca.crt` and located in the current directory.

```bash
curl -X GET --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/users
```
