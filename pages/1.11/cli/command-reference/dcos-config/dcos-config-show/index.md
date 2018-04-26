---
layout: layout.pug
navigationTitle:  dcos config show
title: dcos config show
menuWeight: 2
excerpt: How to show the cluster configuration file

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


# Description
The dcos config show command will display the DC/OS configuration file contents of the currently [attached](/1.11/cli/command-reference/dcos-cluster/dcos-cluster-attach/) cluster.

# Usage

```bash
dcos config show <name> [OPTION]
```

# Options

None.

# Positional arguments

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `<name>`   |             |  The name of the property. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos config](/1.11/cli/command-reference/dcos-config/) |  Manage DC/OS configuration. |

# Examples

## View a specific config value

In this example, the DC/OS URL is shown.

```bash
dcos config show core.dcos_url
```

Here is the output:

```bash
https://your-cluster-9vqnkrq5pt2n-2781474.cloue-1.elb.amazonaws.com
```

## View all config values

In this example, all config values are shown.

```bash
dcos config show
```

Here is the output:

```bash
core.dcos_url https://your-cluster-9vqnkrq5pt2n-2781474.cloue-1.elb.amazonaws.com
core.ssl_verify false
```
