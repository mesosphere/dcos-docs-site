---
layout: layout.pug
navigationTitle:  dcos job schedule remove
title: dcos job schedule remove
menuWeight: 7
excerpt: Removing a job schedule

enterprise: false
---


# Description
The `dcos job schedule remove` command allows you to remove a job schedule.

# Usage

```bash
dcos job schedule remove <job-id> <schedule-file> [OPTION]
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

# Examples

## Remove a job

In this example, a job named `my-job` is removed.

```bash
dcos job remove my-job
```


