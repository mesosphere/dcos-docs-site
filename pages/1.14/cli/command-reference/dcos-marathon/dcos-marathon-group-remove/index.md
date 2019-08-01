---
layout: layout.pug
navigationTitle:  dcos marathon group remove
title: dcos marathon group remove
menuWeight: 19
excerpt: Removing a Marathon application from DC/OS
render: mustache
model: /mesosphere/dcos/1.14/data.yml
enterprise: false
---

# Description

The `dcos marathon group remove` command allows you to remove applications from DC/OS.

# Usage

```bash
dcos marathon group remove [--force] <group-id>
```

# Options

| Name |  Description |
|---------|-------------|
| `-h`, `--help` | Display info about usage of this command. |
| `--force`   |  Disable checks in Marathon during updates. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<group-id>`   |   The group ID. You can view a list of the group IDs with the `dcos marathon group list` command.|

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/mesosphere/dcos/1.14/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

