---
layout: layout.pug
navigationTitle: Server-Side-Encrytion
title: Encryption
menuWeight: 35
excerpt: Server-Side-Encryption for Minio
featureMaturity:
enterprise: false
---

Minio supports S3 server-side-encryption. Users can encrypt their data using SSE-C keys. According to the S3 specification the minio server will reject any SSE-C request made over an insecure (non-TLS) connection. This means that SSE-C **requires** TLS / HTTPS. Users can start Minio server with TLS using [Guide to Configuring DC/OS Access for Minio](/security/index.md). For more information on encrypting objects using SSE-C keys, please refer [how to use minio server side encryption with aws cli](https://github.com/minio/cookbook/blob/master/docs/how-to-use-minio-server-side-encryption-with-aws-cli.md).
