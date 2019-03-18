---
layout: layout.pug
navigationTitle:  dcos marathon deployment stop
title: dcos marathon deployment stop
menuWeight: 16
excerpt: Cancelling in-progress application deployment

enterprise: false
---


# Description
The `dcos marathon deployment stop` command allows you to cancel the in-progress deployment of an application.

# Usage

```bash
dcos marathon deployment stop <deployment-id> [OPTION]
```

# Options

None.

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<deployment-id>`   |   The deployment ID. You can view a list of the deployment IDs with the `dcos marathon deployment list` command. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.13/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |


