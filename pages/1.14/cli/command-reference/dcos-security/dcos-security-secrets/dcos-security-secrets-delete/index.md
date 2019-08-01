---
layout: layout.pug
navigationTitle:  dcos security secrets delete
title: dcos security secrets delete
menuWeight: 310
excerpt: Deleting a secret
render: mustache
model: /1.14/data.yml
enterprise: true
---

# Description

The `dcos security secrets delete` command deletes a secret, including secrets stored under the path PATH.

# Usage

```
dcos security secrets delete [OPTIONS] PATH
```

# Options

| Name |  Description |
|------------------|----------------------|
|`-s`, `--store-id <text>` | Secrets backend to use.|
|  `-h`, `--help`        |   Show this message and exit. |

## Positional Arguments

| Name |  Description |
|---------|-------------|
| `PATH` | URL or IP address of path of secret. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos security secrets](/mesosphere/dcos/1.14/cli/command-reference/dcos-security/dcos-security-secrets/) |  Manage your secrets. |
