---
layout: layout.pug
navigationTitle: Control Plane Certificate
title: Control Plane Certificate
menuWeight: 8
excerpt: Configure Certificates for the Control Plane
beta: false
enterprise: false
---

<!-- markdownlint-disable MD004 MD007 MD025 MD030 -->

By default, Konvoy creates a self-signed internal Certificate Authority (CA) for the Kubernetes Control Plane.
This CA is used to create certificates for various Kubernetes components such as [Etcd and the Api Sever][certificate_details].

## Custom Internal Certificate Authority

You can provide your own CA to be used internally.
Currently, we do not support using an external CA, such as LetsEncrypt, for the Kubernetes Control Plane.

### Pre-requisites

Providing a Custom Internal Certificate Authority requires a:

- CA Certificate (in PEM-format) - `ca.crt`
- CA Key (unencrypted RSA private key) - `ca.key`

### Instructions

Place the two files as `ca.crt` and `ca.key` in the `$(pwd)/extras/pki` directory before creating the cluster.
Running `konvoy up` will use your CA.

You can verify your certificate with the following commands with `openssl`:

```bash
openssl s_client -showcerts -connect "your-api-server-host-from-admin.conf:6443" </dev/null 2>/dev/null|openssl x509 -outform PEM >apiserver.crt
openssl verify -CAfile extras/pki/ca.crt apiserver.crt

# output:
# apiserver.crt: OK
```

[certificate_details]: https://kubernetes.io/docs/setup/best-practices/certificates/
