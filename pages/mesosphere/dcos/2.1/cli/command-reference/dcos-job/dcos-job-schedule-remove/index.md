---
layout: layout.pug
navigationTitle:  dcos job schedule remove
title: dcos job schedule remove
menuWeight: 7
excerpt: Removing a job schedule
render: mustache
model: /mesosphere/dcos/2.0/data.yml
enterprise: false
---


# Description
The `dcos job schedule remove` command allows you to remove a job schedule.

# Usage

```bash
dcos job schedule remove <job-id> <schedule-id>
```

# Options

| Name |  Description |
|---------|-------------|
|`-h`, `--help` |   Print usage. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<job-id>`   |  Specify the job ID.  You can view the job IDs with the `dcos job list` command.|
| `<schedule-id>`   |   The schedule ID. |



# Examples

## Remove a job

In this example, a job named `my-job` is removed.

```bash
dcos job remove my-job
```


# Parent command

| Command | Description |
|---------|-------------|
| [dcos job](/mesosphere/dcos/2.0/cli/command-reference/dcos-job/) |  Deploy and manage jobs in DC/OS. |
