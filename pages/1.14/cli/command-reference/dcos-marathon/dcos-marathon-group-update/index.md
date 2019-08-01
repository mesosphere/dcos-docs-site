---
layout: layout.pug
navigationTitle:  dcos marathon group update
title: dcos marathon group update
menuWeight: 22
excerpt: Updating Marathon group properties
enterprise: false
render: mustache
model: /1.14/data.yml
---


# Description

The `dcos marathon group update` command allows you to update Marathon group properties.

# Usage

```bash
dcos marathon group update [--force] <group-id> [<properties>...]
```

# Options

| Name |  Description |
|---------|-------------|
| `-h`, `--help` | Display info about usage of this command. |
| `--force`   |  Disable checks in Marathon during updates. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<group-id>`   |  The group ID. You can view a list of the group IDs with the `dcos marathon group list` command.|
| `<properties>`   | List of one or more JSON object properties, separated by a space. The list must be formatted as `<key>=<value>`. For example, `cpus=2.0 mem=308`. If omitted, properties are read from a JSON object provided on stdin. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/mesosphere/dcos/1.14/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

