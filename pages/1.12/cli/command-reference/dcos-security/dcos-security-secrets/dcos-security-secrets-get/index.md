---
layout: layout.pug
navigationTitle:  dcos security secrets get
title: dcos security secrets get
menuWeight: 315
excerpt: Retrieving a secret
enterprise: true
---

# Description

The `dcos security secrets get` command allows you to retrieve a secret from the secrets store by a specified path.

# Usage 

```
dcos security secrets get [OPTIONS] PATH
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
| [dcos security secrets](/1.12/cli/command-reference/dcos-security/dcos-security-secrets/) |  Manage your secrets. |