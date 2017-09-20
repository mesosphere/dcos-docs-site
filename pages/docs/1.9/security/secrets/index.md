---
layout: layout.pug
title: Secrets
menuWeight: 40
excerpt:
featureMaturity:
enterprise: true
navigationTitle:  Secrets
---

Use the Enterprise DC/OS Secret Store to secure sensitive information like database passwords, API tokens, and private keys. Storing secrets in secret paths allows you to restrict which services can retrieve the value. 

[Authorized Marathon services](/docs/1.9/overview/security/spaces/) can retrieve the secrets at deployment and store their values under environment variables. 

In addition, the [Secrets API](/docs/1.9/security/secrets/secrets-api/) allows you to [seal](/docs/1.9/security/secrets/seal-store/)/[unseal](/docs/1.9/security/secrets/unseal-store/) and [reinitialize](/docs/1.9/security/secrets/custom-key/) the Secret Store. 

You can also find information about secrets in the [Overview](/docs/1.9/overview/security/secrets/) and [Permissions](/docs/1.9/security/perms-reference/#secrets) sections.


