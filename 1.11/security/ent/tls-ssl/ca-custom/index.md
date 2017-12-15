---
layout: layout.pug
navigationTitle:  Using a Custom CA Certificate
title: Using a Custom CA Certificate
menuWeight: 50
excerpt:

enterprise: true
---

Each DC/OS cluster has its own DC/OS certificate authority (CA). By default, that CA uses an automatically generated globally unique root CA certificate for signing other certificates. In lieu of using the auto-generated root CA certificate, you can configure DC/OS Enterprise to use a custom CA certificate, which can be a root CA certificate or an intermediate CA certificate.

The benefits of using a custom CA certificate for your DC/OS Enterprise cluster include:

- Ensuring that all X.509 certificates used within the DC/OS cluster (for both signing and encrypting) derive from your organization's X.509 certification hierarchy.
- Controlling security properties of the key pair (such as type and strength) used for signing DC/OS component certificates.
- Ensuring that all DC/OS components (including Admin Router) present browser-trusted certificates.

Custom CA certificate support is enabled by three install time [configuration parameters](/1.11/installing/ent/custom/configuration/configuration-parameters/#ca-certificate-path-dcos-enterprise-only):

- `ca_certificate_path`
- `ca_certificate_key_path`
- `ca_certificate_chain_path`

**Note:** 

- Only custom CA certificates that have an associated RSA-type key pair are supported.
- You can use a custom CA certificate only with a new 1.10 install.

# Procedure

1. Using a [custom setup file and the CLI or advanced installer](/1.11/installing), provide the paths to the custom CA certificate, corresponding private key, and optionally corresponding intermediate CA certificates and/or a root CA certificate as part of the chain. All files must be placed in `genconf` directory in the home directory of your bootstrap node. The installer verifies the data.
1. Before installing DC/OS to all nodes, place the private key file corresponding to the custom CA certificate specified in `ca_certificate_key_path` securely on all master nodes in `/var/lib/dcos/pki/tls/CA/private/custom_ca.key`. The file must be readable by the root user and have 0600 permissions set.
