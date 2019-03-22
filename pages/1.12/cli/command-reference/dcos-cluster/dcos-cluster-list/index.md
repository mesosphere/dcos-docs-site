---
layout: layout.pug
navigationTitle:  dcos cluster list
title: dcos cluster list
menuWeight: 3
excerpt: Listing the clusters that are connected to the DC/OS CLI
enterprise: false
---

# Description
The `dcos-cluster list` command will list the clusters that are connected to the DC/OS CLI.

# Usage

```bash
dcos cluster list [--attached --json]
```

Output will be similar to:

```
dcos cluster list
      NAME                    CLUSTER ID                  STATUS    VERSION           URL            
MyCluster  00548eb6-9626-47d8-9076-d57b56752225  AVAILABLE    1.12    https://100.220.241.100 
```

# Options

| Name | Description |
|---------|-------------|
| `--attached`   | Attached clusters only |
| `--json`   |  Display a JSON-formatted list |


# Parent command

| Command | Description |
|---------|-------------|
| [dcos cluster](/1.12/cli/command-reference/dcos-cluster/) | Manage DC/OS clusters. |

# Examples
For examples, see [Cluster Connections](/1.12/administering-clusters/multiple-clusters/cluster-connections/).
