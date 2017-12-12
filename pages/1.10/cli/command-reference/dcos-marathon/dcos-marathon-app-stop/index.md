---
layout: layout.pug
navigationTitle:  dcos marathon app stop
title: dcos marathon app stop
menuWeight: 8
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


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
| [dcos marathon](/1.10/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

<!-- # Examples -->
