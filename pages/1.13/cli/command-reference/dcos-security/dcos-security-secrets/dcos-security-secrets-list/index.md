---
layout: layout.pug
navigationTitle:  dcos security secrets list
title: dcos security secrets list
menuWeight: 315
excerpt: Listing secrets
render: mustache
model: /1.13/data.yml
enterprise: true
---

# Description

The `dcos security secrets list` command will list all secrets stored in a given path.

# Usage

```
dcos security secrets list [OPTIONS] PATH
```

# Options

| Name |  Description |
|------------------|----------------------|
|`-s`, `--store-id <text>` | Secrets backend to use.|
|`-j`, `--json`       |    Output data in JSON format.|
|  `-h`, `--help`        |   Show this message and exit. |

## Positional Arguments

| Name |  Description |
|---------|-------------|
| `PATH` | URL or IP address of path of secret. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos security secrets](/1.13/cli/command-reference/dcos-security/dcos-security-secrets/) |  Manage your secrets. |
