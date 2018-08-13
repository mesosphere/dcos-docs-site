---
layout: layout.pug
navigationTitle:  dcos task ls
title: dcos task ls
menuWeight: 2
excerpt: Display the list of files in the Mesos task directory

enterprise: false
---

# Description
Print the list of files in the Mesos task sandbox.

# Usage

```bash
dcos task ls <task> <path> [OPTION]
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--completed`   |             | Print completed and in-progress tasks. |
| `--long`   |             |  Print full Mesos sandbox file attributes. |

# Positional arguments

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `<task>`   |             |  A full task ID, a partial task ID, or a regular expression. |
| `<path>`   |     `.`      |  The Mesos sandbox directory path. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos task](/1.11/cli/command-reference/dcos-task/)   | Manage DC/OS tasks. |  
