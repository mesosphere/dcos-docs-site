---
layout: layout.pug
navigationTitle:  dcos marathon task list
title: dcos marathon task list
menuWeight: 29
excerpt: Displaying all tasks
enterprise: false
render: mustache
model: /1.14/data.yml
---


# Description
The `dcos marathon task list` command displays a list of all tasks.

# Usage

```bash
dcos marathon task list [--json|--quiet] [<app-id>]
```

# Options

| Name |  Description |
|---------|-------------|
| `--json`   |  Displays JSON-formatted data. |
| `-q`, `--quiet` | Display IDs only for list. |
| `-h`, `--help` | Display info about usage of this command. |


## Positional arguments

| Name |  Description |
|---------|-------------|
| `<app-id>`   |   The application ID. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.14/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |


