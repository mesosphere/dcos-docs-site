---
layout: layout.pug
title: dcos job show
menuWeight: 10
excerpt: ""
featureMaturity: ""
enterprise: 'no'
navigationTitle:  dcos job show
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->

    
# Description
Show the job definition.

# Usage

```bash
dcos job show <job-id> [OPTION]
```

# Options

None.

# Positional arguments

| Name, shorthand | Default | Description |
navigationTitle:  dcos job show
|---------|-------------|-------------|
| `<job-id>`   |             |  Specify the job ID. |

# Parent command

| Command | Description |
navigationTitle:  dcos job show
|---------|-------------|
| [dcos job](/1.10/cli/command-reference/dcos-job/) |  Deploy and manage jobs in DC/OS. |

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
    "maxLaunchDelay": 3600,
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
