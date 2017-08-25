---
layout: layout.pug
title: dcos marathon pod list
menuWeight: 25
excerpt: ""
featureMaturity: ""
enterprise: 'no'
navigationTitle:  dcos marathon pod list
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
navigationTitle:  dcos marathon pod list
|---------|-------------|-------------|
| `--config-schema`   |             |  Show the configuration schema for the Marathon subcommand. |
| `--json`   |             |  Print JSON-formatted data. |

# Parent command

| Command | Description |
navigationTitle:  dcos marathon pod list
|---------|-------------|
| [dcos marathon](/1.10/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

# Examples

# List Pods
List pods and the number of containers they have with the following command:
```
dcos marathon pod list
```
