---
layout: layout.pug
navigationTitle:  dcos security cluster ca sign
title: dcos security cluster ca sign
menuWeight: 20
excerpt: Signing a CSR
enterprise: true
---

# Description

The `dcos security cluster ca sign` command allows you to sign a CSR.

# Options

| Name | Description |
|----------|---------------|
| `--csr <filename>` | Path to a CSR to sign.  (Required) |
|  `-p`, `--profile <text>` |  Signing profile to use.|
|  `-h`, `--help` |  Show this message and exit.|


# Usage

```
Usage: dcos security cluster ca sign [OPTIONS]

  Sign a CSR.

Options:
  --csr FILENAME      Path to a CSR to sign.  [required]
  -p, --profile TEXT  Signing profile to use.
  -h, --help          Show this message and exit.
```