---
layout: layout.pug
navigationTitle:  dcos job schedule add
title: dcos job schedule add
menuWeight: 6
excerpt: Adding a schedule to a job

enterprise: false
---


# Description
The `dcos job schedule add` command allows you to add a schedule to a job.

# Usage

```bash
dcos job schedule add <job-id> <schedule-file> [OPTION]
```

# Options

None.

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<job-id>`   |  Specify the job ID.  You can view the job IDs with the `dcos job list` command. |
| `<schedule-file>`   |  A JSON formatted job schedule file. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos job](/1.13/cli/command-reference/dcos-job/) |  Deploy and manage jobs in DC/OS. |

# Examples

For examples using `job add`, see the [documentation](/1.13/deploying-jobs/examples/#create-job-schedule).
