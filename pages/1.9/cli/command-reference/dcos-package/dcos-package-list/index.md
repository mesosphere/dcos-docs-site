---
layout: layout.pug
navigationTitle:  dcos package list
title: dcos package list
menuWeight: 2
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


# Description
Print a list of the installed DC/OS packages.

# Usage

```bash
dcos package list <package-name> [OPTION]
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--app-id=<app-id>`   |             |  The application ID. |
| `--cli`   |             |  Command line only. |
| `--json`   |             |  JSON-formatted data. |

# Positional arguments

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `<package-name>`   |             |  Name of the DC/OS package. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos package](/1.9/cli/command-reference/dcos-package/)   | Install and manage DC/OS software packages. |

# Examples

For an example, see the [documentation](/1.9/deploying-services/install/).
