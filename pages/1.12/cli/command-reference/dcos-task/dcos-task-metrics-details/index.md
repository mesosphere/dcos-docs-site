---
layout: layout.pug
navigationTitle:  dcos task metrics details
title: dcos task metrics details
menuWeight: 9
excerpt: Display all metrics for a specified task
enterprise: false
---

# Description

The `dcos task metrics details` command will display a table of all metrics for the task specified by `<task-id>`.

# Usage

```bash
dcos task metrics details <task-id> [--json]
```

# Options

| Name |  Description |
|---------|-------------|
| `<task-id>` | A full task ID, a partial task ID, or a Unix shell wildcard pattern (eg. 'my-task*').|
| `--json`  | Print JSON-formatted list of tasks. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos task](/1.12/cli/command-reference/dcos-task/)   | Manage DC/OS tasks. |
