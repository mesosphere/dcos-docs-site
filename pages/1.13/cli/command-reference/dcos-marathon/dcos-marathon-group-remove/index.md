---
layout: layout.pug
navigationTitle:  dcos marathon group remove
title: dcos marathon group remove
menuWeight: 19
excerpt: Removing a Marathon application from DC/OS

enterprise: false
---

# Description
The `dcos marathon group remove` command allows you to remove applications from DC/OS.

# Usage

```bash
dcos marathon group remove <group-id> [OPTION]
```

# Options

| Name, shorthand |  Description |
|---------|-------------|
| `--force`   |  Disable checks in Marathon during updates. |

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<group-id>`   |   The group ID. You can view a list of the group IDs with the `dcos marathon group list` command.|

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.13/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

