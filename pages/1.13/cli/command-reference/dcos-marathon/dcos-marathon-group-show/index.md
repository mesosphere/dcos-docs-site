---
layout: layout.pug
navigationTitle:  dcos marathon group show
title: dcos marathon group show
menuWeight: 21
excerpt: Display a list of groups

enterprise: false
---


# Description
The `dcos marathon group show` command displays a detailed list of groups.

# Usage

```bash
dcos marathon group show <group-id> [OPTION]
```

# Options

| Name, shorthand |  Description |
|---------|-------------|
| `--group-version=<group-version>`   |   The group version to use for the command. It can be specified as an absolute or relative value. Absolute values must be in ISO8601 date format. Relative values must be specified as a negative integer and they represent the version from the currently deployed group definition. |

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<group-id>`   |  The group ID. You can view a list of the group IDs with the `dcos marathon group list` command.|

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.13/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

