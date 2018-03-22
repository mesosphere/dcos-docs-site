---
layout: layout.pug
navigationTitle:  Secrets
title: Secrets
menuWeight: 60
excerpt:

enterprise: true
---

Use the DC/OS Enterprise Secret Store to secure sensitive information like database passwords, API tokens, and private keys. Storing secrets in secret paths allows you to restrict which services can retrieve the value.

[Authorized Marathon services](/1.11/security/ent/#spaces) can retrieve the secrets at deployment and store their values under environment variables or mount them as files.

In addition, the [Secrets API](/1.11/security/ent/secrets/secrets-api/) allows you to [seal](/1.11/security/ent/secrets/seal-store/)/[unseal](/1.11/security/ent/secrets/unseal-store/) and [reinitialize](/1.11/security/ent/secrets/custom-key/) the Secret Store.

You can also find information about secrets in the [Permissions Reference](/1.11/security/ent/perms-reference/#secrets) section.

## Secret types

The DC/OS Enterprise Secrets service supports text and binary secrets types. A text secret is a text value encoded with UTF-8 encoding. A binary secret can hold any binary data.

### Text secrets

A text secrets supports storing text passwords, JSON documents, YAML documents. All values have to be encoded in UTF-8. A text secret can be viewed and edited in the DC/OS UI. When application is using a text secret it must decode value from environment variable or from a file with UTF-8 codec.

### Binary secrets

A binary secret can store any binary sequence. This is useful for binary files, like Java KeyStore, Kerberos keytab files. A text can be stored in binary secret and choose the encoding of stored text. That can help if Marathon application expects text encoded with a codec different from UTF-8.

### What type of secret to use

If a secret is needed that can be viewed and edited using the DC/OS UI it should be stored as a [text secret](#text-secrets). If your secret data lives in a file and you would like to transmit it unchanged, as-is (for guarantee) to your Marathon application, use a [binary secret](#binary-secrets).
