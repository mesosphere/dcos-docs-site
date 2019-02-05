---
layout: layout.pug
navigationTitle:  dcos marathon task stop
title: dcos marathon task stop
menuWeight: 31
excerpt: Stopping a task

enterprise: false
---


# Description
the `dcos marathon task stop` command allows you to stop a task.

# Usage

```bash
dcos marathon task stop <task-id> [OPTION]
```

# Options

| Name, shorthand |  Description |
|---------|-------------|
| `--wipe`   |  Wipe persistent data. |

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<task-id>`   |    The task ID. You can view a list of the task IDs with the `dcos marathon task list` command. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.13/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

