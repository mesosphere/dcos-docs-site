---
layout: layout.pug
navigationTitle:  dcos task exec
title: dcos task exec
menuWeight: 2
excerpt: Launching a process inside of a task's container

enterprise: false
---

# Description
The `dcos task exec` command allows you to launch a process (`<cmd>`) inside of a task's (`<task>`) container. To use this command, the task must be in a Universal Containerizer Runtime (UCR) container.

# Usage

```bash
dcos task exec [--interactive --tty] <task> <cmd> [<args>...]
```

# Options

| Name |  Description |
|---------|-------------|
| `--interactive, -i`   |  Attach a STDIN stream to the remote command for an interactive session. |
| `--tty, -t`   |   Attach a TTY to the remote stream. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<args>`   |  Additional arguments to pass to the command (`<cmd>`). |
| `<cmd>`   |  The command to run inside the remote task's container. For example: `/bin/bash`. |
| `<task>`   |   A full task ID, a partial task ID, or a regular expression. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos task](/1.14/cli/command-reference/dcos-task/)   | Manage DC/OS tasks. |

# Examples

For examples, see the debugging [documentation](/1.14/monitoring/debugging/).
