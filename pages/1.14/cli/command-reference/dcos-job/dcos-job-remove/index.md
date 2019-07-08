---
layout: layout.pug
navigationTitle:  dcos job remove
title: dcos job remove
menuWeight: 4
excerpt: Removing jobs
enterprise: false
render: mustache
model: /1.14/data.yml
---


# Description

The `dcos job remove` command allows you to remove jobs.

# Usage

```bash
dcos job remove <job-id> [--stop-current-job-runs]
```

# Options

| Name |  Description |
|---------|-------------|
| `--stop-current-job-runs`   |  Indicates on a job removal that all current running jobs should be killed. |
|`-h`, `--help` |   Print usage. |

## Positional arguments

| Name | Description |
|---------|-------------|
| `<job-id>`   |  Specify the job ID. You can view the job IDs with the `dcos job list` command. |



# Examples

## Remove a job

In this example, a job with the ID `my-job` is removed.

```bash
dcos job remove my-job
```

# Parent command

| Command | Description |
|---------|-------------|
| [dcos job](/1.14/cli/command-reference/dcos-job/) |  Deploy and manage jobs in DC/OS. |
