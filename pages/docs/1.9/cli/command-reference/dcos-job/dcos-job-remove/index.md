---
layout: layout.pug
title: dcos job remove
menuWeight: 4
excerpt: ""
featureMaturity: ""
enterprise: 'no'
navigationTitle:  dcos job remove
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->

    
# Description
Remove jobs.

# Usage

```bash
dcos job remove <job-id> [OPTION]
```

# Options

| Name, shorthand | Default | Description |
navigationTitle:  dcos job remove
|---------|-------------|-------------|
| `--stop-current-job-runs`   |             |  Remove all running jobs. |

# Positional arguments

| Name, shorthand | Default | Description |
navigationTitle:  dcos job remove
|---------|-------------|-------------|
| `<job-id>`   |             |  Specify the job ID. |

# Parent command

| Command | Description |
navigationTitle:  dcos job remove
|---------|-------------|
| [dcos job](/docs/1.9/cli/command-reference/dcos-job/) |  Deploy and manage jobs in DC/OS. |

# Examples

## Remove a job

In this example, a job with the ID `my-job` is removed.

```bash
dcos job remove my-job
```

**Tip:** You can view the job IDs with the `dcos job list` command.
