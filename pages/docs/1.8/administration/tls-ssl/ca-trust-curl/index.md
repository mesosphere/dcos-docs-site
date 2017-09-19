---
layout: layout.pug
title: Establishing trust in your curl commands
menuWeight: 400
excerpt: >
  If you have not set up a proxy, you
  should use `--cacert dcos-ca.crt` in
  your curl commands in `permissive` and
  `strict` security modes.
featureMaturity: preview
enterprise: true
navigationTitle:  Establishing trust in your curl commands
---

**Prerequisite:** A local copy of the [root certificate of your DC/OS CA](/docs/1.8/administration/tls-ssl/get-cert/).

If you have not [set up a proxy](/docs/1.8/administration/tls-ssl/haproxy-adminrouter/), you should use `--cacert dcos-ca.crt` in your curl commands in `permissive` and `strict` security modes. 

An example follows which assumes that the file is named `dcos-ca.crt` and located in the current directory.

```bash
curl -X GET --cacert dcos-ca.crt -H "Authorization: token=$(dcos config show core.dcos_acs_token)" $(dcos config show core.dcos_url)/acs/api/v1/users
```