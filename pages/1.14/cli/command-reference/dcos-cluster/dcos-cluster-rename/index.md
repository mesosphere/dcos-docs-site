---
layout: layout.pug
navigationTitle:  dcos cluster rename
title: dcos cluster rename
menuWeight: 5
excerpt: Renaming a cluster
enterprise: false
---

# Description
The `dcos cluster rename` command will rename a configured cluster.

# Usage

```bash
dcos cluster rename <cluster> <name> [flags]
```

# Options
| Name |  Description |
|---------|-------------|
|  `-h`, `--help`   | Help for this command. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<cluster>`   |  Name of connected cluster |
| `<name>`   |  New name of connected cluster |


# Examples
For examples, see [Cluster Connections](/1.13/administering-clusters/multiple-clusters/cluster-connections/).

# Parent command

| Command | Description |
|---------|-------------|
| [dcos cluster](/1.13/cli/command-reference/dcos-cluster/) | Manage your DC/OS clusters |
