---
layout: layout.pug
navigationTitle:  dcos cluster list
title: dcos cluster list
menuWeight: 4
excerpt: Listing the clusters that are connected to the DC/OS CLI

enterprise: false
---

# Description
The `dcos-cluster list` command allows you to list the clusters that are connected to the DC/OS CLI.

# Usage

```bash
dcos cluster list [--attached --json]
```

# Options

| Name, shorthand | D Description |
|---------|-------------|
| `--attached`   | Attached clusters only. |
| `--json`   |  Display a JSON-formatted list. |


# Parent command

| Command | Description |
|---------|-------------|
| [dcos cluster](/1.11/cli/command-reference/dcos-cluster/) | Manage DC/OS clusters. |

# Examples
For examples, see [Cluster Connections](/1.11/administering-clusters/multiple-clusters/cluster-connections/).
