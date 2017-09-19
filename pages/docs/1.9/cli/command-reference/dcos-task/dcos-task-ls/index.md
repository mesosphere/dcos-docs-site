---
layout: layout.pug
title: dcos task ls
menuWeight: 2
excerpt:
featureMaturity:
enterprise: false
navigationTitle:  dcos task ls
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


# Description
Print the list of files in the Mesos task sandbox.

# Usage

```bash
dcos task ls <task> <path> [OPTION]
```

# Options

| Name, shorthand | Default | Description |
navigationTitle:  dcos task ls
|---------|-------------|-------------|
| `--completed`   |             | Print completed and in-progress tasks. |
| `--long`   |             |  Print full Mesos sandbox file attributes. |

# Positional arguments

| Name, shorthand | Default | Description |
navigationTitle:  dcos task ls
|---------|-------------|-------------|
| `<task>`   |             |  A full task ID, a partial task ID, or a regular expression. |
| `<path>`   |     `.`      |  The Mesos sandbox directory path. |

# Parent command

| Command | Description |
navigationTitle:  dcos task ls
|---------|-------------|
| [dcos task](/docs/1.9/cli/command-reference/dcos-task/)   | Manage DC/OS tasks. |  
