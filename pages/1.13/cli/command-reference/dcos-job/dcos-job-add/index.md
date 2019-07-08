---
layout: layout.pug
navigationTitle:  dcos job add
title: dcos job add
menuWeight: 0
excerpt: Adding a job
enterprise: false
render: mustache
model: /1.13/data.yml
---

# Description

The `dcos job add` command lets you add a job from a JSON-formated configuration file.

# Usage

```bash
dcos job add <job-file>
```
# Options

| Name |  Description |
|---------|-------------|
|`-h`, `--help` |   Print usage. |

## Positional arguments

| Name | Description |
|---------|-------------|
| `<job-file>`   | Specifies a JSON-formatted job definition. |



# Examples

For job examples, see the [Create a Job](/1.13/deploying-jobs/examples/#create-job).

For information on how to create a job using this command, see [Add a job](/1.13/deploying-jobs/quickstart/#add-a-job-2).

# Parent command

| Command | Description |
|---------|-------------|
| [dcos job](/1.13/cli/command-reference/dcos-job/) |  Deploy and manage jobs in DC/OS. |
