---
layout: layout.pug
title: dcos marathon group update
menuWeight: 22
excerpt: ""
featureMaturity: ""
enterprise: 'no'
navigationTitle:  dcos marathon group update
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


# Description
Deploy and manage applications to DC/OS.

# Usage

```bash
dcos marathon group update <group-id> <properties> <key>=<value> [OPTION]
```

# Options

| Name, shorthand | Default | Description |
navigationTitle:  dcos marathon group update
|---------|-------------|-------------|
| `--force`   |             | Disable checks in Marathon during updates. |
# Positional arguments

| Name, shorthand | Default | Description |
navigationTitle:  dcos marathon group update
|---------|-------------|-------------|
| `<group-id>`   |             |  The group ID. |
| `<properties>`   |             |  List of one or more JSON object properties, separated by a space. The list must be formatted as `<key>=<value>`. For example, `cpus=2.0 mem=308`. If omitted, properties are read from a JSON object provided on stdin. |

# Parent command

| Command | Description |
navigationTitle:  dcos marathon group update
|---------|-------------|
| [dcos marathon](/docs/1.9/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

<!-- # Examples -->
