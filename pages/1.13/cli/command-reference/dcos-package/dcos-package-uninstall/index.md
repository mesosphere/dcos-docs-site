---
layout: layout.pug
navigationTitle:  dcos package uninstall
title: dcos package uninstall
menuWeight: 7
excerpt: Uninstalling a package

enterprise: false
---

# Description
The `dcos package uninstall` command allows you to uninstall a package.

# Usage

```bash
dcos package uninstall <package-name> [OPTION]
```

# Options

| Name, shorthand | Description |
|---------|-------------|
| `--all`   |   All packages. |
| `--app`   |  Application only. |
| `--app-id=<app-id>`   |   The application ID. |
| `--cli`   |   Command line only. |

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<package-name>`   |   Name of the DC/OS package. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos package](/1.13/cli/command-reference/dcos-package/)   | Install and manage DC/OS software packages. |

# Examples

For an example, see the [documentation](/1.13/deploying-services/uninstall/).
