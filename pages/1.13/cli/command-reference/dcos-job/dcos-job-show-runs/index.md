---
layout: layout.pug
navigationTitle:  dcos job show runs
title: dcos job show runs
menuWeight: 11
excerpt: Displaying the status of job runs

enterprise: false
---


# Description
The `dcos job show runs` command displays the successful and failure status of job runs.

# Usage

```bash
dcos job show runs <job-id> [OPTION]
```

# Options

| Name, shorthand | Description |
|---------|-------------|
| `--json`   |   Displays JSON-formatted list. |
| `--q`   | Displays an array of run IDs only. |
| `--run-id <run-id>`   |  The ID of a job run.   You can view the job IDs with the `dcos job list` command.|

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<job-id>`   |  Specify the job ID. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos job](/1.13/cli/command-reference/dcos-job/) |  Deploy and manage jobs in DC/OS. |

# Examples

## Show the run status

In this example, the successful runs for a job are shown.

```bash
dcos job show runs my-scheduled-job
```

Here is the output:

```bash
JOB ID            ID                            STARTED AT
my-scheduled-job  20170218001959YVKlq  2017-02-18T00:19:59.417+0000
my-scheduled-job  20170217230705AfpRn  2017-02-17T23:07:05.218+0000
```
