---
layout: layout.pug
navigationTitle:  dcos security org service-accounts keypair
title: dcos security org service-accounts keypair
menuWeight: 175
excerpt: Creating a public-private keypair
render: mustache
model: /1.14/data.yml
enterprise: true
---

# Description

The `dcos security org service-accounts keypair` command lets you create a public-private keypair for use with service accounts.

# Usage

```
dcos security org service-accounts keypair [OPTIONS] PRIVATE_KEY PUBLIC_KEY
```

# Options

| Name |  Description |
|---------|-------------|
|  `-h`, `--help` |  Show this message and exit.|
| `-l`, `--key-length [2048|4096]` | Length of the RSA key. |

## Positional Arguments

| Name |  Description |
|---------|-------------|
| `PRIVATE_KEY` | Private key. (Required)|
| `PUBLIC_KEY` | Public key. (Required)|

