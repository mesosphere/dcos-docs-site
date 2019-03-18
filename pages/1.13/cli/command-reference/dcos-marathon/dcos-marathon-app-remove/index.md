---
layout: layout.pug
navigationTitle:  dcos marathon app remove
title: dcos marathon app remove
menuWeight: 4
excerpt: Removing an application

enterprise: false
---


# Description
The `dcos marathon app remove` command allows you to remove an application.

# Usage

```bash
dcos marathon app remove <app-id> [OPTION]
```

# Options

| Name, shorthand |  Description |
|---------|-------------|
| `--force`   |  Disable checks in Marathon during updates. |

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<app-id>`   |  The application ID.  You can view a list of the application IDs with the `dcos marathon app list` command. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.13/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |


