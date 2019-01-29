---
layout: layout.pug
navigationTitle:  dcos cluster attach
title: dcos cluster attach
menuWeight: 2
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


# Description
Attach the CLI to a connected DC/OS cluster. When you run the [dcos cluster setup](/1.10/cli/command-reference/dcos-cluster/dcos-cluster-setup/) command, the cluster is automatically attached.

# Usage

```bash
dcos cluster attach <name>
```

# Positional arguments

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `<name>`   |             | DC/OS cluster name. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos cluster](/1.10/cli/command-reference/dcos-cluster/) | Manage connections to DC/OS clusters. |

# Examples
For examples, see [Connecting to Multiple Clusters](/1.10/cli/multi-cluster-cli/).
