---
layout: layout.pug
navigationTitle:  dcos security cluster ca sign
title: dcos security cluster ca sign
menuWeight: 20
excerpt: Signing a CSR
render: mustache
model: /1.14/data.yml
enterprise: true
---

# Description

The `dcos security cluster ca sign` command allows you to sign a Certificate Signing Request (CSR).

# Usage

```
dcos security cluster ca sign [OPTIONS]
```

# Options

| Name | Description |
|----------|---------------|
| `--csr <filename>` | Path to a CSR to sign.  (Required) |
|  `-p`, `--profile <text>` |  Signing profile to use.|
|  `-h`, `--help` |  Show this message and exit.|


# Parent command

| Command | Description |
|---------|-------------|
| [dcos security cluster ca](/1.14/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-ca/) | View DC/OS security cluster certificate authority information. |
