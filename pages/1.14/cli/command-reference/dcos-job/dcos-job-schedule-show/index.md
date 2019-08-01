---
layout: layout.pug
navigationTitle:  dcos job schedule show
title: dcos job schedule show
menuWeight: 8
excerpt: Viewing a job schedule
render: mustache
model: /1.14/data.yml
enterprise: false
---

# Description

The `dcos job schedule show` command allows you to view a job schedule.

# Usage

```bash
dcos job schedule show <job-id> [--json]
```

# Options

| Name |  Description |
|---------|-------------|
|`-h`, `--help` |   Print usage. |
| `--json`   |  Print JSON-formatted list instead of a table.|


## Positional arguments

| Name | Description |
|---------|-------------|
| `<job-id>`   |  Specify the job ID.  You can view the job IDs with the `dcos job list` command.|



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
# Parent command

| Command | Description |
|---------|-------------|
| [dcos job](/mesosphere/dcos/1.14/cli/command-reference/dcos-job/) |  Deploy and manage jobs in DC/OS. |
