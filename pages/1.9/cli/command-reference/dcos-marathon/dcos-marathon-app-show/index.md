---
layout: layout.pug
navigationTitle:  dcos marathon app show
title: dcos marathon app show
menuWeight: 6
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


# Description
Deploy and manage applications to DC/OS.

# Usage

```bash
dcos marathon app show <app-id> [OPTION]
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--app-version=<app-version>`   |             | The version of the application to use. It can be specified as an absolute or relative value. Absolute values must be in ISO8601 date format. Relative values must be specified as a negative integer and they represent the version from the currently deployed application definition. |

# Positional arguments

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `<app-id>`   |             |  The application ID. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.9/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

<!-- # Examples -->
