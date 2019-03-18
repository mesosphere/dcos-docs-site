---
layout: layout.pug
navigationTitle:  dcos job run
title: dcos job run
menuWeight: 5
excerpt: Running a DC/OS job

enterprise: false
---



# Description
The `dcos job run` command allows you to run a job now.

# Usage

```bash
dcos job run <job-id> [OPTION]
```

# Options

None.

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<job-id>`   |   Specify the job ID. You can view the job IDs with the `dcos job list` command.|

# Parent command

| Command | Description |
|---------|-------------|
| [dcos job](/1.13/cli/command-reference/dcos-job/) |  Deploy and manage jobs in DC/OS. |

# Examples

## Run a job

In this example, you can run a job named `my-job`.

```bash
dcos job run my-job
```

