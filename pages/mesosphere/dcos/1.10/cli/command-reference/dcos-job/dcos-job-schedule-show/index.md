---
layout: layout.pug
navigationTitle:  dcos job schedule show
title: dcos job schedule show
menuWeight: 8
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->

    
# Description
Show a job schedule.

# Usage

```bash
dcos job schedule show <job-id> [OPTION]
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--json`   |             |  Print JSON-formatted list. |

# Positional arguments

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `<job-id>`   |             |  Specify the job ID. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos job](/mesosphere/dcos/1.10/cli/command-reference/dcos-job/) |  Deploy and manage jobs in DC/OS. |

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
