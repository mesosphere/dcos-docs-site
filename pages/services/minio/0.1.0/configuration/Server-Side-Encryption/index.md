---
layout: layout.pug
navigationTitle: Encryption
title: Server-Side-Encryption
menuWeight: 35
excerpt: Encrypt your data using SSE-C keys
featureMaturity:
enterprise: false
model: /services/minio/data.yml
render: mustache
---

DC/OS {{ model.techName }} supports S3 server-side-encryption (SSE). You can encrypt your data using SSE-C keys. In accordance with the S3 specification,  the {{ model.serviceName }} server will reject any SSE-C request made over an insecure (non-TLS) connection. This means that SSE-C **requires** TLS/HTTPS. You can start the {{ model.techName }} server with TLS using [Security Section](../../security). 

For more information on encrypting objects using SSE-C keys, please refer to [How to use {{ model.techName }} server side encryption with AWS CLI](https://github.com/minio/cookbook/blob/master/docs/how-to-use-minio-server-side-encryption-with-aws-cli.md).
