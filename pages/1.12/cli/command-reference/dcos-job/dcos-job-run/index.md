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
dcos job run <job-id> [--json]
```

# Options

| Name |  Description |
|---------|-------------|
|`-h`, `--help` |   Print usage. |
| `--json` | Print JSON-formatted list instead of a table.  |


## Positional arguments

| Name |  Description |
|---------|-------------|
| `<job-id>`   |   Specify the job ID. You can view the job IDs with the `dcos job list` command.|


# Examples

## Run a job

In this example, you can run a job named `my-job`.

```bash
dcos job run my-job
```

# Parent command

| Command | Description |
|---------|-------------|
| [dcos job](/1.12/cli/command-reference/dcos-job/) |  Deploy and manage jobs in DC/OS. |