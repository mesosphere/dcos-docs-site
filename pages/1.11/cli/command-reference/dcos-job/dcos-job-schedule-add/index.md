---
layout: layout.pug
navigationTitle:  dcos job schedule add
title: dcos job schedule add
menuWeight: 6
excerpt: Add a schedule to a job

enterprise: false
---

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
| [dcos job](/1.11/cli/command-reference/dcos-job/) |  Deploy and manage jobs in DC/OS. |

# Examples

For examples using `job add`, see the [documentation](/1.11/deploying-jobs/examples/#create-job-schedule).
