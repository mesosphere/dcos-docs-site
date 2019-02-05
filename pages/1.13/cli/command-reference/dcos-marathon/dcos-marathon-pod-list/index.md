---
layout: layout.pug
navigationTitle:  dcos marathon pod list
title: dcos marathon pod list
menuWeight: 25
excerpt: Viewing the deployed pods

enterprise: false
---

# Description
The `dcos marathon pod list` command displays a list of deployed pods.

# Usage

```bash
dcos marathon pod list [OPTION]
```

# Options

| Name, shorthand |  Description |
|---------|-------------|
| `--config-schema`   | Show the configuration schema for the Marathon subcommand. |
| `--json`   |   Displays JSON-formatted data. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.13/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

# Examples

## List Pods
List pods and the number of containers they have with the following command:
```
dcos marathon pod list
```
