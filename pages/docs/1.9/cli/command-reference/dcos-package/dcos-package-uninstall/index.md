---
layout: layout.pug
title: dcos package uninstall
menuWeight: 7
excerpt:
featureMaturity:
enterprise: false
navigationTitle:  dcos package uninstall
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
navigationTitle:  dcos package uninstall
|---------|-------------|-------------|
| `--all`   |             |  All packages. |
| `--app`   |             |  Application only. |
| `--app-id=<app-id>`   |             |  The application ID. |
| `--cli`   |             |  Command line only. |

# Positional arguments

| Name, shorthand | Default | Description |
navigationTitle:  dcos package uninstall
|---------|-------------|-------------|
| `<package-name>`   |             |  Name of the DC/OS package. |
        
# Parent command

| Command | Description |
navigationTitle:  dcos package uninstall
|---------|-------------|
| [dcos package](/docs/1.9/cli/command-reference/dcos-package/)   | Install and manage DC/OS software packages. |

# Examples

For an example, see the [documentation](/docs/1.9/deploying-services/uninstall/).
