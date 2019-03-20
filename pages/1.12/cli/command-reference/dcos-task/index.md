---
layout: layout.pug
navigationTitle:  dcos task
title: dcos task
menuWeight: 16
excerpt: Managing DC/OS tasks
enterprise: false
---

# Description

The `dcos task` commands let you manage DC/OS tasks.

# Usage

```bash
dcos task [--all | --completed] [--json <task>]
```

# Options

| Name |  Description |
|---------|-------------|
| `--all`   |    Print completed and in-progress tasks. |
| `--completed`   |   Print completed tasks. |
| `--json`   | Print JSON-formatted list of tasks. |

# Positional Arguments

| Name |  Description |
|---------|-------------|
| `<task>` | A full task ID, a partial task ID, or a Unix shell wildcard pattern (eg. 'my-task*').|


# Commands

