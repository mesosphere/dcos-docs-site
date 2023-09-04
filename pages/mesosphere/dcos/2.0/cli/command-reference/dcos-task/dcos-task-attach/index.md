---
layout: layout.pug
navigationTitle:  dcos task attach
title: dcos task attach
menuWeight: 1
excerpt: Attaching a process inside of a task's container
render: mustache
model: /mesosphere/dcos/2.0/data.yml
enterprise: false
---

# Description

The `dcos task attach` command allows you to attach the CLI to the `stdio` of an already running task.

```bash
dcos task attach [--no-stdin] <task>
```

To detach from a task, type the sequence `CTRL-p CTRL-q`.

# Options

| Name |  Description |
|---------|-------------|
| `--no-stdin`   |  Do not attach the `stdin` of the CLI to the task. |

## Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<task>`   |   A full task ID, a partial task ID, or a UNIX shell wildcard pattern (for example, `my-task*`). |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos task](/mesosphere/dcos/2.0/cli/command-reference/dcos-task/)   | Manage DC/OS tasks. |
