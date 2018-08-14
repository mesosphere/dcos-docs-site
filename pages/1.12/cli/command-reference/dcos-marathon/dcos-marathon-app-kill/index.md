---
layout: layout.pug
navigationTitle:  dcos marathon app kill
title: dcos marathon app kill
menuWeight: 2
excerpt: Killing an active application instance

enterprise: false
---


# Description
Kill a running application instance.

# Usage

```bash
dcos marathon app kill <app-id> [OPTION]
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--host=<host>`   |             | The hostname that is running app. |
| `--scale`   |             | Scale the app down after performing the operation.  |

# Positional arguments

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `<app-id>`   |             |  The application ID. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.12/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

<!-- # Examples -->
