---
layout: layout.pug
title: dcos cluster
menuWeight: 1
excerpt:
featureMaturity:
enterprise: false
navigationTitle:  dcos cluster
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


# Description
This command manages connections to DC/OS clusters.

# Usage

```bash
dcos cluster
```

# Options

| Name, shorthand | Default | Description |
navigationTitle:  dcos cluster
|---------|-------------|-------------|
| `--help, h`   |             |  Print usage. |
| `--info`   |             |  Print a short description of this subcommand. |
| `--version, v`   |             | Print version information. |

# Child commands

| Command | Description |
navigationTitle:  dcos cluster
|---------|-------------|
| [dcos cluster attach](/docs/1.10/cli/command-reference/dcos-cluster/dcos-cluster-attach/)   |  Attach the CLI to a connected DC/OS cluster. |
| [dcos cluster list](/docs/1.10/cli/command-reference/dcos-cluster/dcos-cluster-list/)       |  List the clusters that are connected to the DC/OS CLI.  |
| [dcos cluster remove](/docs/1.10/cli/command-reference/dcos-cluster/dcos-cluster-remove/)   |  Remove a cluster from the DC/OS CLI configuration.   |
| [dcos cluster rename](/docs/1.10/cli/command-reference/dcos-cluster/dcos-cluster-rename/)   |  Rename a cluster in the DC/OS CLI configuration.  |
| [dcos cluster setup](/docs/1.10/cli/command-reference/dcos-cluster/dcos-cluster-setup/)     |  Connects, authenticates, and attaches the DC/OS CLI to a DC/OS cluster. Combines `dcos config set core.dcos_url`, `dcos auth login`, and `docs cluster attach`. |
