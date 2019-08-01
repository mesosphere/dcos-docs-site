---
layout: layout.pug
navigationTitle:  dcos task ls
title: dcos task ls
menuWeight: 7
excerpt: Display the list of files in the Mesos task directory
render: mustache
model: /mesosphere/dcos/1.14/data.yml
enterprise: false
---

# Description
The `dcos task ls` command displays a list of the files in the Mesos task sandbox.

# Usage

```bash
dcos task ls [--all | --completed] [--long] [<task>] [<path>]
```

# Options

| Name |  Description |
|---------|-------------|
| `--all`   | Print completed and in-progress tasks. |
| `--completed`   | Displays completed and in-progress tasks. |
| `--long`   |  Displays full Mesos sandbox file attributes. |

## Positional arguments

| Name | Default | Description |
|---------|-------------|-------------|
| `<task>`   |             |  A full task ID, a partial task ID, or a regular expression. |
| `<path>`   |     `.`      |  The Mesos sandbox directory path. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos task](/mesosphere/dcos/1.14/cli/command-reference/dcos-task/)   | Manage DC/OS tasks. |
