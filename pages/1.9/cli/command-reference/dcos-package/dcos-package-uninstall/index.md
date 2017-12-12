---
layout: layout.pug
navigationTitle:  dcos package uninstall
title: dcos package uninstall
menuWeight: 7
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


# Description
Uninstall a package.

# Usage

```bash
dcos package uninstall <package-name> [OPTION]
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--all`   |             |  All packages. |
| `--app`   |             |  Application only. |
| `--app-id=<app-id>`   |             |  The application ID. |
| `--cli`   |             |  Command line only. |

# Positional arguments

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `<package-name>`   |             |  Name of the DC/OS package. |
        
# Parent command

| Command | Description |
|---------|-------------|
| [dcos package](/1.9/cli/command-reference/dcos-package/)   | Install and manage DC/OS software packages. |

# Examples

For an example, see the [documentation](/1.9/deploying-services/uninstall/).
