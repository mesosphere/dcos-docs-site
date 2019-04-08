---
layout: layout.pug
navigationTitle:  dcos license renew
title: dcos license renew
menuWeight: 3
excerpt: Renewing a cluster license

enterprise: true
---

# Description
The `dcos license renew` command associates a new DC/OS license with the cluster and makes it active. This command uses the license at the given PATH.

# Usage

```bash
Usage: dcos license renew [OPTIONS] PATH
```

# Options

| Name |  Description |
|---------|-------------|
| `--help`   |  Show this message and exit. |


## Positional arguments

| Name |  Description |
|---------|-------------|
| `PATH`  |   The path to a file containing the license. |



# Examples
For examples, see [Licenses](/1.13/administering-clusters/licenses/).

# Parent command

| Command | Description |
|---------|-------------|
| [dcos license](/1.13/cli/command-reference/dcos-license/) | Manage DC/OS cluster licenses. |
