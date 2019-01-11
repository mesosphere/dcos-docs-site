---
layout: layout.pug
navigationTitle:  dcos cluster attach
title: dcos cluster attach
menuWeight: 2
excerpt: Attaching the CLI to a connected or linked cluster

enterprise: false
---

# Description
The `dcos cluster attach` command will attach the CLI to a connected or [linked](/1.12/cli/command-reference/dcos-cluster/dcos-cluster-link/) cluster. When you run the [`dcos cluster setup`](/1.12/cli/command-reference/dcos-cluster/dcos-cluster-setup/) command, the cluster is automatically attached.

# Usage

```bash
dcos cluster attach [<connected-cluster-name> | <linked-cluster-name> | <connected-cluster-id> | <linked-cluster-id>]
```

# Positional arguments

| Name, shorthand | Description |
|---------|-------------|
| `<connected-cluster-name>`   | Name of connected cluster. |
| `<linked-cluster-name>`   |  Name of linked cluster. |
| `<connected-cluster-id>`   |  ID of connected cluster. |
| `<linked-cluster-id>`   |  ID of linked cluster. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos cluster](/1.12/cli/command-reference/dcos-cluster/) | Manage connections to DC/OS clusters. |

# Examples
For examples, see [Cluster Connections](/1.12/administering-clusters/multiple-clusters/cluster-connections/) and [Cluster Links](/1.12/administering-clusters/multiple-clusters/cluster-links/).
