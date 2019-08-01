---
layout: layout.pug
navigationTitle:  dcos marathon task stop
title: dcos marathon task stop
menuWeight: 31
excerpt: Stopping a task
render: mustache
model: /1.14/data.yml
enterprise: false
---


# Description
The `dcos marathon task stop` command allows you to stop a task.

# Usage

```bash
dcos marathon task stop [--wipe] <task-id>
```

# Options

| Name |  Description |
|---------|-------------|
| `--wipe`   |  Wipe persistent data. |
| `-h`, `--help` | Display info about usage of this command. |


## Positional arguments

| Name |  Description |
|---------|-------------|
| `<task-id>`   |    The task ID. You can view a list of the task IDs with the `dcos marathon task list` command. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/mesosphere/dcos/1.14/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

