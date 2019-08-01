---
layout: layout.pug
navigationTitle:  dcos security secrets update
title: dcos security secrets update
menuWeight: 320
excerpt: Updating secrets
render: mustache
model: /mesosphere/dcos/1.14/data.yml
enterprise: true
---

# Description

The `dcos security secrets update` command lets you update an existing secret stored in a specified path.

# Usage

 ```
dcos security secrets update [OPTIONS] PATH
 ```

# Options

| Name |  Description |
|------------------|----------------------|
|`-s`, `--store-id <text>` | Secrets backend to use.|
|`-v`, `--value <text>`       |    Value of the secret.|
| `-t`, `--text-file`, `--value-file <filename>` | Treat contents of the file as value of the secret. The contents are assumed to be text encoded via UTF-8. |
|  `-f`, `--file <filename>`     |        Use the raw file contents as the value of the secret: pass the unmodified byte sequence to DC/OS Secrets service. |
|  `-h`, `--help`        |   Show this message and exit. |

## Positional Arguments

| Name |  Description |
|---------|-------------|
| `PATH` | URL or IP address of path of secret. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos security secrets](/mesosphere/dcos/1.14/cli/command-reference/dcos-security/dcos-security-secrets/) |  Manage your secrets. |
