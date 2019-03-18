---
layout: layout.pug
navigationTitle:  dcos task ls
title: dcos task ls
menuWeight: 2
excerpt: Display the list of files in the Mesos task directory

enterprise: false
---

# Description
The `dcos task ls` command displays a list of the files in the Mesos task sandbox.

# Usage

```bash
dcos task ls <task> <path> [OPTION]
```

# Options

| Name, shorthand |  Description |
|---------|-------------|
| `--completed`   | Displays completed and in-progress tasks. |
| `--long`   |  Displays full Mesos sandbox file attributes. |

# Positional arguments

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `<task>`   |             |  A full task ID, a partial task ID, or a regular expression. |
| `<path>`   |     `.`      |  The Mesos sandbox directory path. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos task](/1.13/cli/command-reference/dcos-task/)   | Manage DC/OS tasks. |
