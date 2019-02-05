---
layout: layout.pug
navigationTitle:  dcos package install
title: dcos package install
menuWeight: 1
excerpt: Installing a package

enterprise: false
---


# Description
The `dcos package install` command allows you to install a package.

# Usage

```bash
dcos package install <package-name> [OPTION]
```

# Options

| Name, shorthand |  Description |
|---------|-------------|
| `--app`   |    Application only. |
| `--app-id=<app-id>`   |   The application ID. |
| `--cli`   |   Command line only. |
| `--options=<file>`   |  Path to a JSON file that contains customized package installation options. |
| `--package-version=<package-version>`   |  The package version. |
| `--yes`   |  Disable interactive mode and assume "yes" is the answer to all prompts. |

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<package-name>`   |   Name of the DC/OS package. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos package](/1.13/cli/command-reference/dcos-package/)   | Install and manage DC/OS software packages. |

# Examples

For an example, see the [documentation](/1.13/deploying-services/config-universe-service/).
