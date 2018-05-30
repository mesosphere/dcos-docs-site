---
layout: layout.pug
navigationTitle:  dcos cluster
title: dcos cluster
menuWeight: 3
excerpt: How to manage connections to DC/OS clusters

enterprise: false
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
|---------|-------------|-------------|
| `--help, h`   |             |  Print usage. |
| `--info`   |             |  Print a short description of this subcommand. |
| `--version, v`   |             | Print version information. |

# Child commands

| Command | Description |
|---------|-------------|
| [dcos cluster attach](/1.11/cli/command-reference/dcos-cluster/dcos-cluster-attach/)   |  Attach the CLI to a connected or linked cluster. |
| [dcos cluster link](/1.11/cli/command-reference/dcos-cluster/dcos-cluster-link/)       |  (DC/OS Enterprise only) Link a cluster to another cluster.  |
| [dcos cluster list](/1.11/cli/command-reference/dcos-cluster/dcos-cluster-list/)       |  List the clusters that are connected to the DC/OS CLI.  |
| [dcos cluster remove](/1.11/cli/command-reference/dcos-cluster/dcos-cluster-remove/)   |  Remove a cluster from the DC/OS CLI configuration.   |
| [dcos cluster rename](/1.11/cli/command-reference/dcos-cluster/dcos-cluster-rename/)   |  Rename a cluster in the DC/OS CLI configuration.  |
| [dcos cluster setup](/1.11/cli/command-reference/dcos-cluster/dcos-cluster-setup/)     |  Connects, authenticates, and attaches the DC/OS CLI to a DC/OS cluster. Combines [`dcos config set core.dcos_url`](/1.11/cli/command-reference/dcos-config/dcos-config-set/), [`dcos auth login`](/1.11/cli/command-reference/dcos-auth/dcos-auth-login/), and `docs cluster attach`. |
| [dcos cluster unlink](/1.11/cli/command-reference/dcos-cluster/dcos-cluster-unlink/)   |  (DC/OS Enterprise only) Unlink a cluster from another cluster. |
