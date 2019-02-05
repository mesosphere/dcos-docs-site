---
layout: layout.pug
navigationTitle:  dcos task attach
title: dcos task attach
menuWeight: 0
excerpt: Attaching a process inside of a task's container

enterprise: false
---

# Description

The `dcos task attach` command allows you to attach the CLI to the stdio of an already running task.

```bash
dcos task attach [--no-stdin] <task>
```

To detach from a task, type the sequence `CTRL-p CTRL-q`.

# Options

| Name, shorthand |  Description |
|---------|-------------|
| `--no-stdin`   |  Don't attach the stdin of the CLI to the task. |

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<task>`   |   A full task ID, a partial task ID, or a Unix shell wildcard pattern (eg. 'my-task*'). |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos task](/1.13/cli/command-reference/dcos-task/)   | Manage DC/OS tasks. |
