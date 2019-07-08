---
layout: layout.pug
navigationTitle:  dcos job schedule update
title: dcos job schedule update
menuWeight: 9
excerpt: Updating a job schedule
enterprise: false
render: mustache
model: /1.13/data.yml
---


# Description
The `dcos job schedule update` command allows you to update a schedule on a job.

# Usage

```bash
dcos job schedule update <job-id> <schedule-file>
```

# Options

| Name |  Description |
|---------|-------------|
|`-h`, `--help` |   Print usage. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<job-id>`   |  Specify the job ID.  You can view the job IDs with the `dcos job list` command.|
| `<schedule-file>`   |   A JSON formatted file of a job schedule. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos job](/1.13/cli/command-reference/dcos-job/) |  Deploy and manage jobs in DC/OS. |


