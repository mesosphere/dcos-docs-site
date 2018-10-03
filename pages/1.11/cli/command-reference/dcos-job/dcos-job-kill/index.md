---
layout: layout.pug
navigationTitle:  dcos job kill
title: dcos job kill
menuWeight: 2
excerpt: Ending DC/OS jobs
enterprise: false
---


# Description
The `dcos job kill` command allows you to kill the specified job.

# Usage

```bash
dcos job kill <job-id> [OPTION]
```

# Options

| Name, shorthand |  Description |
|---------|-------------|
| `run-id`   |  The job run ID. |
| `--all`   |  Kill all job runs. |

# Positional arguments

| Name, shorthand | DDescription |
|---------|-------------|
| `<job-id>`   |  Specify the job ID.  You can view the job IDs with the `dcos job list` command.|

# Parent command

| Command | Description |
|---------|-------------|
| [dcos job](/1.11/cli/command-reference/dcos-job/) |  Deploy and manage jobs in DC/OS. |
