---
layout: layout.pug
navigationTitle:  dcos security secrets list
title: dcos security secrets list
menuWeight: 315
excerpt: Listing secrets
enterprise: true
---

# Description

The `dcos security secrets list` command will list all secrets stored in a given path.

# Options

| Name |  Description |
|------------------|----------------------|
|`-s`, `--store-id <text>` | Secrets backend to use.|
|`-j`, `--json`       |    Output data in JSON format.|
|  `-h`, `--help`        |   Show this message and exit. |
| `PATH` | Secrets path. |


# Usage

```
Usage: dcos security secrets list [OPTIONS] PATH

  List secret keys in a given path.

  Lists all secrets stored under the path PATH.

Options:
  -s, --store-id TEXT  Secrets backend to use.
  -j, --json           Output data in JSON format.
  -h, --help           Show this message and exit.
```