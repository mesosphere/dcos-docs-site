---
layout: layout.pug
navigationTitle:  dcos job run
title: dcos job run
menuWeight: 5
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->

    
# Description
Run a job now.

# Usage

```bash
dcos job run <job-id> [OPTION]
```

# Options

None.

# Positional arguments

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `<job-id>`   |             |  Specify the job ID. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos job](/1.10/cli/command-reference/dcos-job/) |  Deploy and manage jobs in DC/OS. |

# Examples

## Run a job

In this example, a job named `my-job` is run.

```bash
dcos job run my-job
```

**Tip:** You can view the job IDs with the `dcos job list` command.
