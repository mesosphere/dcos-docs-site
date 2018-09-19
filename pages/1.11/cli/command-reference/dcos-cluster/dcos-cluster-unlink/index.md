---
layout: layout.pug
navigationTitle:  dcos cluster unlink
title: dcos cluster unlink
menuWeight: 8
excerpt: Unlinking a cluster from another cluster
enterprise: true
---

# Description
The `dcos cluster unlink` command allows you to unlink a cluster from another cluster.

# Usage

```bash
dcos cluster unlink [<linked-cluster-name> | <linked-cluster-id> ]
```

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<linked-cluster-name>`   | ID of linked cluster.  |
| `<linked-cluster-id>`   |  ID of linked cluster.  |

**Note:** If the cluster links successfully there is no output to the console.

# Parent command

| Command | Description |
|---------|-------------|
| [dcos cluster](/1.11/cli/command-reference/dcos-cluster/) | Manage DC/OS clusters. |

# Examples
For examples, see [Cluster Links](/1.11/administering-clusters/multiple-clusters/cluster-links/).
