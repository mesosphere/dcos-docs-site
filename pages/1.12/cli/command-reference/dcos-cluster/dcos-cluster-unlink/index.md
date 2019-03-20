---
layout: layout.pug
navigationTitle:  dcos cluster unlink
title: dcos cluster unlink
menuWeight: 3
excerpt: Unlinking a cluster from another cluster
enterprise: true
---

# Description
The `dcos cluster unlink` command will unlink a cluster.

# Usage

```bash
dcos cluster unlink <name>
```

# Positional arguments

| Name |  Description |
|---------|-------------|-------------|
| `<name>`   | Name of linked cluster  |

If the cluster unlinks successfully there is no output to the console.

# Parent command

| Command | Description |
|---------|-------------|
| [dcos cluster](/1.12/cli/command-reference/dcos-cluster/) | Manage DC/OS clusters. |

# Examples
For examples, see [Cluster Links](/1.12/administering-clusters/multiple-clusters/cluster-links/).
