---
layout: layout.pug
navigationTitle:  dcos marathon app restart
title: dcos marathon app restart
menuWeight: 5
excerpt: Restarting an application
enterprise: false
render: mustache
model: /1.14/data.yml
---


# Description

The `dcos marathon app restart` command allows you to restart an application.

# Usage

```bash
dcos marathon app restart [--force] <app-id>
```

# Options

| Name |  Description |
|---------|-------------|
| `--help`   |  Show this message and exit. |
| `--force`   |  Disable checks in Marathon during updates. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<app-id>`   |  The application ID.  You can view a list of the application IDs with the `dcos marathon app list` command. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.14/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |


