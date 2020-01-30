---
layout: layout.pug
navigationTitle:  dcos security cluster ca sign
title: dcos security cluster ca sign
menuWeight: 20
excerpt: Signing a CSR
render: mustache
model: /mesosphere/dcos/2.0/data.yml
enterprise: true
---

# Description

The `dcos security cluster ca sign` command allows you to sign a Certificate Signing Request (CSR).

# Usage

```bash
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
| [dcos security cluster ca](/mesosphere/dcos/2.0/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-ca/) | View DC/OS security cluster certificate authority information. |
