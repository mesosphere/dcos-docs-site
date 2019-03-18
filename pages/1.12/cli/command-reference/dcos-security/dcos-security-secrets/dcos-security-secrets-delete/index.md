---
layout: layout.pug
navigationTitle:  dcos security secrets delete
title: dcos security secrets delete
menuWeight: 310
excerpt: Deleting a secret
enterprise: true
---

# Description

The `dcos security secrets delete` command deletes a secret, including secrets stored under the path PATH.

# Options

| Name |  Description |
|------------------|----------------------|
|`-s`, `--store-id <text>` | Secrets backend to use.|
|  `-h`, `--help`        |   Show this message and exit. |


# Usage

```
Usage: dcos security secrets delete [OPTIONS] PATH

  Delete a secret.

  Deletes a secret stored under the path PATH.

Options:
  -s, --store-id TEXT  Secrets backend to use.
  -h, --help           Show this message and exit.
```