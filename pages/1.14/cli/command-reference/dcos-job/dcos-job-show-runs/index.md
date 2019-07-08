---
layout: layout.pug
navigationTitle:  dcos job show runs
title: dcos job show runs
menuWeight: 11
excerpt: Displaying the status of job runs
render: mustache
model: /1.14/data.yml
enterprise: false
---


# Description
The `dcos job show runs` command displays the success and failure status of job runs.

# Usage

```bash
dcos job show runs <job-id> [--run-id <run-id>][--json|--quiet]
```

# Options

| Name | Description |
|---------|-------------|
|`-h`, `--help` |   Print usage. |
| `--json`   |   Displays JSON-formatted list. |
| `-q`, `--quiet`   | Indicates a quiet mode which results in just an array of run IDs. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<job-id>`   |  Specify the job ID. |
| `--run-id <run-id>`   |  The ID of a job run.   You can view the job IDs with the `dcos job list` command.|



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

# Parent command

| Command | Description |
|---------|-------------|
| [dcos job](/1.14/cli/command-reference/dcos-job/) |  Deploy and manage jobs in DC/OS. |
