---
layout: layout.pug
navigationTitle:  dcos cluster rename
title: dcos cluster rename
menuWeight: 5
excerpt: Renaming a cluster
enterprise: false
render: mustache
model: /mesosphere/dcos/2.0/data.yml
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
For examples, see [Cluster Connections](/mesosphere/dcos/2.0/administering-clusters/multiple-clusters/cluster-connections/).

# Parent command

| Command | Description |
|---------|-------------|
| [dcos cluster](/mesosphere/dcos/2.0/cli/command-reference/dcos-cluster/) | Manage your DC/OS clusters |
