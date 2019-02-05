---
layout: layout.pug
navigationTitle:  dcos job schedule show
title: dcos job schedule show
menuWeight: 8
excerpt: Viewing a job schedule

enterprise: false
---

# Description

The `dcos job schedule show` command allows you to view a job schedule.

# Usage

```bash
dcos job schedule show <job-id> [OPTION]
```

# Options

| Name, shorthand |  Description |
|---------|-------------|
| `--json`   |   Print JSON-formatted list. |

# Positional arguments

| Name, shorthand | Description |
|---------|-------------|
| `<job-id>`   |  Specify the job ID.  You can view the job IDs with the `dcos job list` command.|

# Parent command

| Command | Description |
|---------|-------------|
| [dcos job](/1.13/cli/command-reference/dcos-job/) |  Deploy and manage jobs in DC/OS. |

# Examples

## View job schedule

In this example, a job named `my-scheduled-job` is reviewed.

```bash
dcos job schedule show my-scheduled-job
```

Here is the output:

```bash
ID             CRON        ENABLED            NEXT RUN            CONCURRENCY POLICY
sleep-nightly  20 0 * * *    True   2017-02-19T00:20:00.000+0000        ALLOW
```
