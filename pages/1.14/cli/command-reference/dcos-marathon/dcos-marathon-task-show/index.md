---
layout: layout.pug
navigationTitle:  dcos marathon task show
title: dcos marathon task show
menuWeight: 30
excerpt: Displaying information about a specific task
enterprise: false
render: mustache
model: /1.14/data.yml
---


# Description
The `dcos marathon task show` command allows you to list a specific task.

# Usage

```bash
dcos marathon task show <task-id>
```

# Options

| Name |  Description |
|---------|-------------|
| `-h`, `--help` | Display info about usage of this command. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<task-id>`   |  The task ID. You can view a list of the task IDs with the `dcos marathon task list` command. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/mesosphere/dcos/1.14/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |


