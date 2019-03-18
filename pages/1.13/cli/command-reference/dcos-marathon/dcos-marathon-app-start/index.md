---
layout: layout.pug
navigationTitle:  dcos marathon app start
title: dcos marathon app start
menuWeight: 7
excerpt: Starting an application

enterprise: false
---


# Description
The `dcos marathon app start` command allows you to start an application.

# Usage

```bash
dcos marathon app start <app-id> [OPTION]
```

# Options

| Name, shorthand |  Description |
|---------|-------------|
| `--force`   |  Disable checks in Marathon during updates. |
| `--instances`   |  The number of instances. |

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<app-id>`   |   The application ID.  You can view a list of the application IDs with the `dcos marathon app list` command.  |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.13/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |


