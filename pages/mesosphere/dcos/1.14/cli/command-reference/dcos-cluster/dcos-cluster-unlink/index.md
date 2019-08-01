---
layout: layout.pug
navigationTitle:  dcos cluster unlink
title: dcos cluster unlink
menuWeight: 3
excerpt: Unlinking a cluster from another cluster
enterprise: true
render: mustache
model: /mesosphere/dcos/1.14/data.yml
---

# Description
The `dcos cluster unlink` command will unlink the current cluster from one of its linked clusters.

# Usage

```bash
dcos cluster unlink <cluster> [flags]
```
# Options

| Name | Description |
|---------|-------------|
| `-h`, `--help`     |  Displays help for this command. |


## Positional arguments

| Name |  Description |
|---------|-------------|
| `<name>`   | Name of linked cluster (Required) |

If the cluster unlinks successfully there is no output to the console.


# Examples
For examples, see [Cluster Links](/mesosphere/dcos/1.14/administering-clusters/multiple-clusters/cluster-links/).

# Parent command

| Command | Description |
|---------|-------------|
| [dcos cluster](/mesosphere/dcos/1.14/cli/command-reference/dcos-cluster/) | Manage DC/OS clusters. |
