---
layout: layout.pug
navigationTitle:  dcos security cluster ca newcert
title: dcos security cluster ca newcert
menuWeight: 5
excerpt: Creating and signing a new certificate
render: mustache
model: /1.14/data.yml
enterprise: true
---

# Description

The `dcos security cluster ca newcert` command allows you to create and sign a new certificate. You should only create a new certificate based on the command line options provided below.

# Usage

```
dcos security cluster ca newcert [OPTIONS]
```

# Options

| Name | Description|
|----------|---------------|
|`--cn <text>` | Canonical name. (Required)|
| `--host <text>`| SAN host, may be specified multiple times (Required)|
|`--name-c <text>`| Country|
|`--name-st <text>`|State |
|`--name-o <text>`| Organization|
|`--name-l <text>`| Locality|
|`--name-ou <text>`| Organization unit|
|`--key-algo [rsa|ecdsa]`| Key algorithm|
|`--key-size [256|384|521|2048|4096|8192]`| Key size|
|`-p`, `--profile <text>`| Signing profile to use|
|`-j`, `--json`| Output data in JSON format|
|`-h`, `--help`| Show this message and exit|



# Example

```
dcos security cluster ca newcert --cn Certificate_1 --host SAN-1
certificate: '-----BEGIN CERTIFICATE-----

    MIIDoTCCAomgAwIBAgIUBT...kJJdXc8+KbNdmWCj8Jrp4F6kl1

    -----END CERTIFICATE-----

    '
certificate_request: '-----BEGIN CERTIFICATE REQUEST-----

    MIICgDCCAWgCAQAwGDEWMBQGA1UE...WtxMohnRkIif/9nYMugdWaMoP7o=

    -----END CERTIFICATE REQUEST-----

    '
private_key: '-----BEGIN RSA PRIVATE KEY-----

    MIIEowIBAAKCAQEA0o6J+/q4YLSC9...R40PgUuPfHXR0flwdp9JN5

    -----END RSA PRIVATE KEY-----

    '
```

# Parent command

| Command | Description |
|---------|-------------|
| [dcos security cluster ca](/1.14/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-ca/) | View DC/OS security cluster certificate authority information. |
