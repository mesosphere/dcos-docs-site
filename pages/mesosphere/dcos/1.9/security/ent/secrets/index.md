---
layout: layout.pug
navigationTitle:  Secrets
title: Secrets
menuWeight: 40
excerpt:

enterprise: true
---

Use the DC/OS Enterprise Secret Store to secure sensitive information like database passwords, API tokens, and private keys. Storing secrets in secret paths allows you to restrict which services can retrieve the value. 

[Authorized Marathon services](/mesosphere/dcos/1.9//security/ent/#spaces) can retrieve the secrets at deployment and store their values under environment variables. 

In addition, the [Secrets API](/mesosphere/dcos/1.9/security/ent/secrets/secrets-api/) allows you to [seal](/mesosphere/dcos/1.9/security/ent/secrets/seal-store/) and [unseal](/mesosphere/dcos/1.9/security/ent/secrets/unseal-store/) the Secret Store.

You can also find information about secrets in the [Permissions](/mesosphere/dcos/1.9/security/ent/perms-reference/#secrets) sections.
