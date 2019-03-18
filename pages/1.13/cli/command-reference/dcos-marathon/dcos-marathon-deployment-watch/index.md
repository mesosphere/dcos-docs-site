---
layout: layout.pug
navigationTitle:  dcos marathon deployment watch
title: dcos marathon deployment watch
menuWeight: 16
excerpt: Monitoring application deployments

enterprise: false
---


# Description
The `dcos marathon deployment watch` command allows you to monitor deployments.

# Usage

```bash
dcos marathon deployment watch <deployment-id> [OPTION]
```

# Options

| Name, shorthand | Description |
|---------|-------------|
| `--interval=<interval>`   |  Number of seconds to wait between actions. |
| `--max-count=<max-count>`   |   Maximum number of entries to fetch and return. |


# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<deployment-id>`   | The deployment ID. You can view a list of the deployment IDs with the `dcos marathon deployment list` command.|

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.13/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

