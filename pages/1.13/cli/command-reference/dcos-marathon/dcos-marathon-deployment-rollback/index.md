---
layout: layout.pug
navigationTitle:  dcos marathon deployment rollback
title: dcos marathon deployment rollback
menuWeight: 15
excerpt: Removing a deployed application

enterprise: false
---

# Description
The `dcos marathon deployment rollback` command allows you to remove a deployed application.

# Usage

```bash
dcos marathon deployment rollback <deployment-id> [OPTION]
```

# Options

None.

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<deployment-id>`   |  The deployment ID. You can view a list of the application IDs with the `dcos marathon deployment list` command. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.13/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

