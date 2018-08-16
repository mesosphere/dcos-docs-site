---
layout: layout.pug
navigationTitle:  dcos marathon group update
title: dcos marathon group update
menuWeight: 22
excerpt: Updating Marathon group properties

enterprise: false
---


# Description
Update Marathon group properties.

# Usage

```bash
dcos marathon group update <group-id> <properties> <key>=<value> [OPTION]
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--force`   |             | Disable checks in Marathon during updates. |
# Positional arguments

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `<group-id>`   |             |  The group ID. |
| `<properties>`   |             |  List of one or more JSON object properties, separated by a space. The list must be formatted as `<key>=<value>`. For example, `cpus=2.0 mem=308`. If omitted, properties are read from a JSON object provided on stdin. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.11/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

<!-- # Examples -->
