---
layout: layout.pug
navigationTitle:  dcos job show
title: dcos job show
menuWeight: 10
excerpt: Displaying job definitions
enterprise: false
render: mustache
model: /data.yml
---


# Description
The `dcos job show` command displays a job definition.

# Usage

```bash
dcos job schedule show <job-id> [--json]
```

# Options

| Name |  Description |
|---------|-------------|
|`-h`, `--help` |   Print usage. |

## Positional arguments

| Name | Description |
|---------|-------------|
| `<job-id>`   |   Specify the job ID.  You can view the job IDs with the `dcos job list` command.|


# Examples

## Show the job definition

In this example, the job definition for `my-scheduled-job` is shown.

```bash
dcos job show my-scheduled-job
```

Here is the output:

```bash
{
  "description": "A job that sleeps on a schedule",
  "id": "my-scheduled-job",
  "labels": {},
  "run": {
    "artifacts": [],
    "cmd": "sleep 20000",
    "cpus": 0.01,
    "disk": 0,
    "env": {},
    "maxLaunchDelaySeconds": 300,
    "mem": 32,
    "placement": {
      "constraints": []
    },
    "restart": {
      "policy": "NEVER"
    },
    "volumes": []
  }
}
```
# Parent command

| Command | Description |
|---------|-------------|
| [dcos job](/1.13/cli/command-reference/dcos-job/) |  Deploy and manage jobs in DC/OS. |
