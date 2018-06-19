---
layout: layout.pug
navigationTitle:  dcos marathon app stop
title: dcos marathon app stop
menuWeight: 8
excerpt: Stopping an application

enterprise: false
---


# Description
Stop an application.

# Usage

```bash
dcos marathon app stop <app-id> [OPTION]
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--force`   |             | Disable checks in Marathon during updates. |
| `--instances`   |             | The number of instances. |

# Positional arguments

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `<app-id>`   |             |  The application ID. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.11/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

<!-- # Examples -->
