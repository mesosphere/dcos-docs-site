---
layout: layout.pug
navigationTitle:  dcos job schedule add
title: dcos job schedule add
menuWeight: 6
excerpt: Adding a schedule to a job
render: mustache
model: /1.14/data.yml
enterprise: false
---


# Description
The `dcos job schedule add` command allows you to add a schedule to a job.

# Usage

```bash
dcos job schedule add <job-id> <schedule-file>
```

# Options

| Name |  Description |
|---------|-------------|
|`-h`, `--help` |   Print usage. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<job-id>`   |  Specify the job ID.  You can view the job IDs with the `dcos job list` command. |
| `<schedule-file>`   |  A JSON formatted file of a job schedule |


# Examples

For examples using `job add`, see the [documentation](/1.14/deploying-jobs/examples/#create-job-schedule).

# Parent command

| Command | Description |
|---------|-------------|
| [dcos job](/1.14/cli/command-reference/dcos-job/) |  Deploy and manage jobs in DC/OS. |
