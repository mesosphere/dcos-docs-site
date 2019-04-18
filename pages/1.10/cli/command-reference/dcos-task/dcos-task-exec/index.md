---
layout: layout.pug
navigationTitle:  dcos task exec
title: dcos task exec
menuWeight: 0
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


# Description
Launch a process (`<cmd>`) inside of a task's (`<task>`) container. To use this command, the task must be in a Universal Containerizer Runtime (UCR) container.

# Usage

```bash
dcos task exec [--interactive --tty] <task> <cmd> [<args>...]
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--interactive, -i`   |             |  Attach a STDIN stream to the remote command for an interactive session. |
| `--tty, -t`   |             |  Attach a TTY to the remote stream. |

# Positional arguments

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `<args>`   |             |  Additional arguments to pass to the command (`<cmd>`). |
| `<cmd>`   |             |  The command to run inside the remote task's container. For example: `/bin/bash`. |
| `<task>`   |             |  A full task ID, a partial task ID, or a regular expression. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos task](/1.10/cli/command-reference/dcos-task/)   | Manage DC/OS tasks. |  

# Examples

For examples, see the debugging [documentation](/1.10/monitoring/debugging/).
