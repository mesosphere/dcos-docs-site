---
layout: layout.pug
navigationTitle:  dcos job schedule update
title: dcos job schedule update
menuWeight: 9
excerpt: Updating a job schedule

enterprise: false
---


# Description
The `dcos job schedule update` command allows you to update a job schedule.

# Usage

```bash
dcos job schedule update <job-id> <schedule-file> [OPTION]
```

# Options

None.

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<job-id>`   |  Specify the job ID.  You can view the job IDs with the `dcos job list` command.|
| `<schedule-file>`   |   A JSON formatted job schedule file. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos job](/1.13/cli/command-reference/dcos-job/) |  Deploy and manage jobs in DC/OS. |


