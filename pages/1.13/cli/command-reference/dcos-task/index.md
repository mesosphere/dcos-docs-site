---
layout: layout.pug
navigationTitle:  dcos task
title: dcos task
menuWeight: 16
excerpt: Managing DC/OS tasks

enterprise: false
---

# Description

Manage Mesos tasks on DC/OS.

Mesos tasks are run by [DC/OS services](/1.13/cli/command-reference/dcos-service/).

# Usage

```bash
dcos task [OPTION]
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--completed`   |             | Print completed and in-progress tasks. |
| `--help, h`   |             |  Print usage. |
| `--info`   |             |  Print a short description of this subcommand. |
| `--json`   |             |  JSON-formatted data. |
| `--version, v`   |             | Print version information. |

# Positional arguments

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `<task>`   |             |  A full task ID, a partial task ID, or a regular expression. |

# dcos task

```bash
Description:
    Manage DC/OS tasks.

Usage:
    dcos task --help
    dcos task --info
    dcos task log [--completed --follow --lines=N] [<task>] [<file>]
    dcos task ls [--long --completed] [<task>] [<path>]
    dcos task [--completed --json <task>]

Command:
    log
        Print the task log. By default, the 10 most recent task logs from stdout
        are printed.
    ls
        Print the list of files in the Mesos task sandbox.

Options:
    --completed
        Print completed and in-progress tasks.
    -h, --help
        Print usage.
    --info
        Print a short description of this subcommand.
    --follow
        Dynamically update the log.
    --json
        Print JSON-formatted list of tasks.
    --lines=N
        Print the last N lines. The default is 10 lines.
    --long
        Print full Mesos sandbox file attributes.
    --version
        Print version information.

Positional Arguments:
    <file>
        Specify the sandbox file to print. The default is stdout.
    <path>
        The Mesos sandbox directory path. The default is '.'.
    <task>
        A full task ID, a partial task ID, or a regular expression.
```
