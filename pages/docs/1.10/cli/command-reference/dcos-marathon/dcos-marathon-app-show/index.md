---
layout: layout.pug
title: dcos marathon app show
menuWeight: 6
excerpt:
featureMaturity:
enterprise: false
navigationTitle:  dcos marathon app show
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
navigationTitle:  dcos marathon app show
|---------|-------------|-------------|
| `--app-version=<app-version>`   |             | The version of the application to use. It can be specified as an absolute or relative value. Absolute values must be in ISO8601 date format. Relative values must be specified as a negative integer and they represent the version from the currently deployed application definition. |

# Positional arguments

| Name, shorthand | Default | Description |
navigationTitle:  dcos marathon app show
|---------|-------------|-------------|
| `<app-id>`   |             |  The application ID. |

# Parent command

| Command | Description |
navigationTitle:  dcos marathon app show
|---------|-------------|
| [dcos marathon](/docs/1.10/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

<!-- # Examples -->
