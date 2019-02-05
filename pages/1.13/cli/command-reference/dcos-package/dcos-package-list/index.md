---
layout: layout.pug
navigationTitle:  dcos package list
title: dcos package list
menuWeight: 2
excerpt: Displaying a list of the installed DC/OS packages

enterprise: false
---


# Description
The `dcos package list` command displays a list of the installed DC/OS packages.

# Usage

```bash
dcos package list <package-name> [OPTION]
```

# Options

| Name, shorthand |  Description |
|---------|-------------|
| `--app-id=<app-id>`   |   The application ID. |
| `--cli`   |   Command line only. |
| `--json`   |   JSON-formatted data. |

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<package-name>`   |   Name of the DC/OS package. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos package](/1.13/cli/command-reference/dcos-package/)   | Install and manage DC/OS software packages. |

# Examples

For an example, see the [documenation](/1.13/deploying-services/install/).
