---
layout: layout.pug
navigationTitle:  dcos task log
title: dcos task log
menuWeight: 5
excerpt: Displaying the task log
render: mustache
model: /1.14/data.yml
enterprise: false
---


# Description
The `dcos task log` command displays the task log.

# Usage

```bash
dcos task log [--all | --completed] [--follow --lines=N] [<task>] [<file>]
```

# Options

| Name | Default | Description |
|---------|-------------|-------------|
| `--all` |             | Displays all information recorded for tasks. |
| `--completed`   |             | Displays completed and in-progress tasks. |
| `--follow`   |             |  Dynamically update the log. |
| `--lines=N`   |     10      |  Displays the last N lines. |

## Positional arguments

| Name | Default | Description |
|---------|-------------|-------------|
| `<task>`   |             |  A full task ID, a partial task ID, or a regular expression. |
| `<file>`   |  `stdout`  |  Specify the sandbox file to print. The default is `stdout`. |

The log file parameters should be paths relative to the Mesos sandbox. For example:

```
dcos task log [mesosID] /mnt/mesos/sandbox/exporter.log
```
will return an error message. Instead, use this format:

```
dcos task log [mesosID] exporter.log
```

# Examples

For an example, see the [logging documentation](/1.14/monitoring/logging/).


# Parent command

| Command | Description |
|---------|-------------|
| [dcos task](/1.14/cli/command-reference/dcos-task/)   | Manage DC/OS tasks. |


