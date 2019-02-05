---
layout: layout.pug
navigationTitle:  dcos cluster unlink
title: dcos cluster unlink
menuWeight: 3
excerpt: Unlinking a cluster from another cluster

enterprise: true
---

# Description
The `dcos cluster unlink` command will unlink a cluster from another cluster.

# Usage

```bash
dcos cluster unlink [<linked-cluster-name> | <linked-cluster-id> ]
```

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|-------------|
| `<linked-cluster-name>`   | ID of linked cluster.  |
| `<linked-cluster-id>`   |  ID of linked cluster.  |

If the cluster links successfully there is no output to the console.

# Parent command

| Command | Description |
|---------|-------------|
| [dcos cluster](/1.13/cli/command-reference/dcos-cluster/) | Manage DC/OS clusters. |

# Examples
For examples, see [Cluster Links](/1.13/administering-clusters/multiple-clusters/cluster-links/).
