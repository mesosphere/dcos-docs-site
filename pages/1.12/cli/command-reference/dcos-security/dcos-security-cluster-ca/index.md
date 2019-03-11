---
layout: layout.pug
navigationTitle:  dcos security cluster ca
title: dcos security cluster ca
menuWeight: 1
excerpt: Interacting with the DC/OS cluster CA
enterprise: true
---


# Description

The `dcos security cluster ca` command allows you to interact with your DC/OS cluster CA -
signing certs, generating CSRs, and signing information retrieval.

# Usage

```
dcos security cluster ca cacert [OPTIONS]
```


# Options

| Name |  Description |
|---------|-------------|
|  `-h`, `--help` |  Show this message and exit.|

# Commands

| Command |  Description |
|---------|-------------|
| `cacert` | Fetch the PEM-encoded signing CA certificate |
| `newcert` | Create and sign a new certificate|
| `newkey` | Create a new key and a new CSR|
| `profile` | Print information about a signing profile|
| `sign` | Sign a CSR |
