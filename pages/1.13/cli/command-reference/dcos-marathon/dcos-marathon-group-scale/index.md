---
layout: layout.pug
navigationTitle:  dcos marathon group scale
title: dcos marathon group scale
menuWeight: 20
excerpt: Scaling a group

enterprise: false
---


# Description
The `dcos marathon group scale` command allows you to scale a group.

# Usage

```bash
dcos marathon group scale <group-id> <scale-factor> [OPTION]
```

# Options

| Name, shorthand | Description |
|---------|-------------|
| `--force`   | Disable checks in Marathon during updates. |

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<group-id>`   |   The group ID. You can view a list of the group IDs with the `dcos marathon group list` command.|
| `<scale-factor>`   |  The factor to scale an application group by. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.13/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

