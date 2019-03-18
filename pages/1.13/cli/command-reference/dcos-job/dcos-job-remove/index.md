---
layout: layout.pug
navigationTitle:  dcos job remove
title: dcos job remove
menuWeight: 4
excerpt: Removing jobs

enterprise: false
---


# Description
The `dcos job remove` command allows you to remove jobs.

# Usage

```bash
dcos job remove <job-id> [OPTION]
```

# Options

| Name, shorthand |  Description |
|---------|-------------|
| `--stop-current-job-runs`   |  Remove all running jobs. |

# Positional arguments

| Name, shorthand | Description |
|---------|-------------|
| `<job-id>`   |  Specify the job ID. You can view the job IDs with the `dcos job list` command. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos job](/1.13/cli/command-reference/dcos-job/) |  Deploy and manage jobs in DC/OS. |

# Examples

## Remove a job

In this example, a job with the ID `my-job` is removed.

```bash
dcos job remove my-job
```

