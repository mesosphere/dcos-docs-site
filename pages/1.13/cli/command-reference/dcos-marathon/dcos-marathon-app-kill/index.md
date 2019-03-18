---
layout: layout.pug
navigationTitle:  dcos marathon app kill
title: dcos marathon app kill
menuWeight: 2
excerpt: Killing an active application instance

enterprise: false
---


# Description
The `dcos marathon app kill` command allows you to kill a running application instance.

# Usage

```bash
dcos marathon app kill <app-id> [OPTION]
```

# Options

| Name, shorthand |  Description |
|---------|-------------|
| `--host=<host>`   | The hostname that is running app. |
| `--scale`   |  Scale the app down after performing the operation.  |

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<app-id>`   |   The application ID. You can view a list of the application IDs with the `dcos marathon app list` command. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.13/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

