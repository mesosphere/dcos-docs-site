---
layout: layout.pug
navigationTitle:  Secrets
title: Secrets
menuWeight: 60
excerpt: Understanding the Secret Store
render: mustache
model: /1.14/data.yml
enterprise: true
---
<!-- The source repository for this topic is https://github.com/dcos/dcos-docs-site -->


The DC/OS Enterprise Secret Store is a place to secure sensitive information like database passwords, API tokens, and private keys. Storing secrets in secret paths allows you to restrict which services can retrieve the value.

[Authorized Marathon services](/1.14//security/ent/#spaces) can retrieve the secrets at deployment and store their values under environment variables. In addition, the [Secrets API](/1.14/security/ent/secrets/secrets-api/) allows you to [seal](/1.14/security/ent/secrets/seal-store/) and [unseal](/1.14/security/ent/secrets/unseal-store/) the Secret Store.

Find more information about secrets in the [Permissions Reference](/1.14/security/ent/perms-reference/#secrets) section.
