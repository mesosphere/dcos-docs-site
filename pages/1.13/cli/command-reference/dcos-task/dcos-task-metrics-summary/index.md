---
layout: layout.pug
navigationTitle:  dcos task metrics summary
title: dcos task metrics summary
menuWeight: 11
excerpt: Display key metrics for a task
render: mustache
model: /1.13/data.yml
enterprise: false
---

# Description

The `dcos task metrics summary` command displays a table of key metrics for the task specified by `<task-id>`.

# Usage

```
dcos task metrics summary <task-id> [--json]
```

# Options

| Name |  Description |
|---------|-------------|
| `<task-id>` | A full task ID, a partial task ID, or a Unix shell wildcard pattern (for example, 'my-task*').|
| `--json`  | Print JSON-formatted list of tasks. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos task](/1.13/cli/command-reference/dcos-task/)   | Manage DC/OS tasks. |
