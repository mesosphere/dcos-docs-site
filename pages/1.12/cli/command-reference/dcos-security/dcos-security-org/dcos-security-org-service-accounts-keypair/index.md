---
layout: layout.pug
navigationTitle:  dcos security org service-accounts keypair
title: dcos security org service-accounts keypair
menuWeight: 175
excerpt: Creating a public-private keypair
enterprise: true
---

# Description

The `dcos security org service-accounts keypair` command lets you create a public-private keypair for use with service accounts.

# Options

| Name |  Description |
|---------|-------------|
|  `-h`, `--help` |  Show this message and exit.|
| `PRIVATE_KEY` | Private key. (Required)|
| `PUBLIC_KEY` | Public key. (Required)|



# Usage

```
Usage: dcos security org service-accounts keypair [OPTIONS] PRIVATE_KEY PUBLIC_KEY

  Create public-private keypair for use with service accounts.

Options:
  -l, --key-length [2048|4096]  Length of the RSA key.
  -h, --help                    Show this message and exit.
```