---
layout: layout.pug
navigationTitle:  dcos security cluster ca newkey
title: dcos security cluster ca newkey
menuWeight: 13
excerpt: Creating a new key and a new CSR
render: mustache
model: /1.14/data.yml
enterprise: true
---

# Description

The `dcos security cluster ca newkey` lets you create a new key and a new CSR.

# Usage

```
dcos security cluster ca newkey [OPTIONS]
```


# Options:

| Name | Description |
|--------|---------------|
|`--cn <text>` |Canonical Name.  (Required)|
|  `--host <text>`|         SAN host, may be specified multiple times.  (Required)|
| `--name-c <text>` |       Country.|
|  `--name-st <text>` |      State.|
| `--name-o <text>` |      Organization.|
|  `--name-l <text>` |       Locality.|
| `--name-ou <text>` |     Organization unit.|
|  `--key-algo <text>` |     Key algorithm.|
|  `--key-size <integer>`|  Key size.|
|  `-j`, `--json`|          Output data in JSON format.|
|  `-h`, `--help`|          Show this message and exit.|



# Example

```
dcos security cluster ca newkey --cn Newkey-1 --host SAN-1
certificate: '-----BEGIN CERTIFICATE-----

    MIIDnDCCAoSgAwIBAgIUGa0ZJB81dGW...2SxjIWJiuH+a5vTgQ+uqkw==

    -----END CERTIFICATE-----

    '
certificate_request: '-----BEGIN CERTIFICATE REQUEST-----

    MIICezCCAWMCAQAwEzERMA8GA1UE...Cd3zi8AAzKw3K1VgxOLF

    -----END CERTIFICATE REQUEST-----

    '
private_key: '-----BEGIN RSA PRIVATE KEY-----

    MIIEowIBAAKCAQEAwC+x2CaCEik10MPRRls...hodkI/cADjayx7Pjz29wt

    -----END RSA PRIVATE KEY-----

    '
```

# Parent command

| Command | Description |
|---------|-------------|
| [dcos security cluster ca](/1.14/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-ca/) | View DC/OS security cluster certificate authority information. |
