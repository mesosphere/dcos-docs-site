---
layout: layout.pug
navigationTitle:  dcos config show
title: dcos config show
menuWeight: 2
excerpt: Showing the cluster configuration file
enterprise: false
---

# Description

The `dcos config show` command will display the DC/OS configuration file contents of the currently [attached cluster](/1.13/cli/command-reference/dcos-cluster/dcos-cluster-attach/).

# Usage

```bash
dcos config set <name> <value> [flags]
```
# Options

| Name |  Description |
|---------|-------------|
| `--help, h`   |   Display usage. |

# Positional arguments

| Name |  Description |
|---------|-------------|
| `<name>`   |  The name of the property |
| `<value>` | The value of the property |



# Examples

## View a specific configuration value

In this example, the DC/OS URL is shown.

```bash
dcos config show core.dcos_url
```

Here is the output:

```bash
https://your-cluster-9vqnkrq5pt2n-2781474.cloue-1.elb.amazonaws.com
```

## View all configuration values

In this example, all config values are shown.

```bash
dcos config show
```

Here is the output:

```bash
cluster.name MyCluster
core.dcos_acs_token ********
core.dcos_url http://mycluster-elasticl-7qbh2zcfyz6h-4734.us-east-1.elb.amazonaws.com
```

# Parent command

| Command | Description |
|---------|-------------|
| [dcos config](/1.13/cli/command-reference/dcos-config/) |  Manage DC/OS configuration |
