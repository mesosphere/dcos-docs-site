---
layout: layout.pug
navigationTitle:  dcos marathon app stop
title: dcos marathon app stop
menuWeight: 8
excerpt: Stopping an application

enterprise: false
---


# Description
The `dcos marathon app stop` command allows you to stop an application.

# Usage

```bash
dcos marathon app stop <app-id> [OPTION]
```

# Options

| Name, shorthand |  Description |
|---------|-------------|
| `--force`   |  Disable checks in Marathon during updates. |
| `--instances`   |  The number of instances. |

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<app-id>`   |   The application ID.  You can view a list of the application IDs with the `dcos marathon app list` command. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.13/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |


