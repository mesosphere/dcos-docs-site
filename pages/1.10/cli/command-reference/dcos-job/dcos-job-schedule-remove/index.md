---
layout: layout.pug
navigationTitle:  dcos job schedule remove
title: dcos job schedule remove
menuWeight: 7
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->

    
# Description
Remove a job schedule.

# Usage

```bash
dcos job schedule remove <job-id> <schedule-file> [OPTION]
```

# Options

None.

# Positional arguments

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `<job-id>`   |             |  Specify the job ID. |
| `<schedule-file>`   |             |  A JSON formatted job schedule file. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos job](/1.10/cli/command-reference/dcos-job/) |  Deploy and manage jobs in DC/OS. |

# Examples

## Remove a job

In this example, a job named `my-job` is removed.

```bash
dcos job remove my-job
```

**Tip:** You can view the job IDs with the `dcos job list` command.
