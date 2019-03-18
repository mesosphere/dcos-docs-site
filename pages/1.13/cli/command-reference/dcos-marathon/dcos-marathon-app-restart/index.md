---
layout: layout.pug
navigationTitle:  dcos marathon app restart
title: dcos marathon app restart
menuWeight: 5
excerpt: Restarting an application

enterprise: false
---


# Description
The `dcos marathon app restart` command allows you to restart an application.

# Usage

```bash
dcos marathon app restart <app-id> [OPTION]
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


