---
layout: layout.pug
navigationTitle:  dcos job schedule add
title: dcos job schedule add
menuWeight: 6
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->

    
# Description
Add a schedule to a job.

# Usage

```bash
dcos job schedule add <job-id> <schedule-file> [OPTION]
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

For examples using `job add`, see the [documentation](/1.10/deploying-jobs/examples/#create-job-schedule).
