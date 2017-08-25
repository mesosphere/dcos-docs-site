---
layout: layout.pug
title: Secrets
menuWeight: 2
excerpt: ""
featureMaturity: preview
enterprise: 'yes'
navigationTitle:  Secrets
---


Use the Enterprise DC/OS Secret Store to secure sensitive information like private keys, API tokens, and database passwords. You can make these values available to authorized services launched by Marathon under environment variables.

DC/OS stores Secret Store data in ZooKeeper encrypted under an unseal key using the Advanced Encryption Standard (AES) algorithm in Galois Counter Mode (GCM). The Secret Store uses the unseal key to encrypt secrets before sending them to ZooKeeper and to decrypt secrets after receiving them from ZooKeeper. This ensures that secrets are encrypted both at rest and in transit. TLS provides an additional layer of encryption on the secrets in transit from ZooKeeper to the Secret Store. 

The unseal key is encrypted under a public GPG key. Requests to the [Secrets API](/docs/1.8/administration/secrets/secrets-api/) return only the encrypted unseal key. When the Secret Store becomes sealed, either manually or due to a failure, the private GPG key must be used to decrypt the unseal key and unseal the Secret Store.

As a convenience, DC/OS automatically generates a new 4096-bit GPG keypair during the bootstrap sequence. It uses this keypair to initialize the Secret Store and stores the keypair in ZooKeeper. 

If you wish to generate your own GPG keypair and store it in an alternate location, you can [reinitialize the Secret Store with a custom GPG keypair](/docs/1.8/administration/secrets/custom-key/).

The Secret Store is available in all security modes. 

By default, you cannot store a secret larger than one megabyte. If you need to exceed this limit, contact Mesosphere support.

We do not support alternate or additional Secret Stores at this time. You should use only the `default` Secret Store provided by Mesosphere. 

Refer to [Logging](/docs/1.8/administration/logging/) for information on how to access the logs.

