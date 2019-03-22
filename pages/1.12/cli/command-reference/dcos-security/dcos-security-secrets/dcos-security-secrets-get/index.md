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

# Options

| Name |  Description |
|------------------|----------------------|
|`-s`, `--store-id <text>` | Secrets backend to use.|
|`-j`, `--json`       |    Output data in JSON format.|
|  `-h`, `--help`        |   Show this message and exit. |

# Usage 

```
Usage: dcos security secrets get [OPTIONS] PATH

  Get a secret from the store by its path.

  Get a secret stored under the path PATH.

Options:
  -s, --store-id TEXT  Secrets backend to use.
  -j, --json           Output data in JSON format.
  -h, --help           Show this message and exit.
```