---
layout: layout.pug
navigationTitle:  Secrets
title: Secrets
menuWeight: 40
excerpt:
featureMaturity:
enterprise: true
---

Use the Enterprise DC/OS Secret Store to secure sensitive information like database passwords, API tokens, and private keys. Storing secrets in secret paths allows you to restrict which services can retrieve the value. 

[Authorized Marathon services](/docs/1.9/overview/security/spaces/) can retrieve the secrets at deployment and store their values under environment variables. 

In addition, the [Secrets API](/docs/1.9/security/ent/secrets/secrets-api/) allows you to [seal](/docs/1.9/security/ent/secrets/seal-store/)/[unseal](/docs/1.9/security/ent/secrets/unseal-store/) and [reinitialize](/docs/1.9/security/ent/secrets/custom-key/) the Secret Store. 

You can also find information about secrets in the [Overview](/docs/1.9/overview/security/secrets/) and [Permissions](/docs/1.9/security/ent/perms-reference/#secrets) sections.


