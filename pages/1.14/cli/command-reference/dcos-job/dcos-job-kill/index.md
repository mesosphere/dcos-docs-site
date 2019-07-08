---
layout: layout.pug
navigationTitle:  dcos job kill
title: dcos job kill
menuWeight: 2
excerpt: Ending DC/OS jobs
enterprise: false
render: mustache
model: /1.14/data.yml
---


# Description
The `dcos job kill` command allows you to kill the specified job.

# Usage

```bash
dcos job kill <job-id> (<run-id>|--all)
```

# Options

| Name |  Description |
|---------|-------------|
|`-h`, `--help` |   Print usage. |
| `--all` | Instead of specifying a `run_id` to kill, indicates all runs should be killed. |


## Positional Arguments

| Name |  Description |
|---------|-------------|
| `run-id`   |  The run ID of a job run. |
| `job-id`   | The job ID. |


# Parent command

| Command | Description |
|---------|-------------|
| [dcos job](/1.14/cli/command-reference/dcos-job/) |  Deploy and manage jobs in DC/OS. |
