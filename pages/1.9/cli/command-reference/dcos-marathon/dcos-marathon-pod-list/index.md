---
layout: layout.pug
navigationTitle:  dcos marathon pod list
title: dcos marathon pod list
menuWeight: 25
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


# Description
List the deployed pods.

# Usage

```bash
dcos marathon pod list [OPTION]
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--config-schema`   |             |  Show the configuration schema for the Marathon subcommand. |
| `--json`   |             |  Print JSON-formatted data. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.9/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

# Examples

# List Pods
List pods and the number of containers they have with the following command:
```
dcos marathon pod list
```
