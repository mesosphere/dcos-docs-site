---
layout: layout.pug
navigationTitle:  dcos cluster remove
title: dcos cluster remove
menuWeight: 5
excerpt: Removing a connected cluster from the DC/OS CLI


enterprise: false
---

# Description
The `dcos-cluster remove` command allows you to remove a connected cluster from the DC/OS CLI.

# Usage

```bash
dcos cluster remove [<cluster-name> | <cluster-id> | --all]
```

# Positional arguments

| Name, shorthand | Description |
|---------|-------------|
| `<cluster-name>`   | Name of connected cluster. |
| `<cluster-id>`   |  ID of connected cluster.  |
# Parent command

| Command | Description |
|---------|-------------|
| [dcos cluster](/1.11/cli/command-reference/dcos-cluster/) | Manage your DC/OS clusters. |

# Examples
For examples, see [Cluster Connections](/1.11/administering-clusters/multiple-clusters/cluster-connections/).
