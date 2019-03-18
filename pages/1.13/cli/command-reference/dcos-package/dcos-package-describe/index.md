---
layout: layout.pug
navigationTitle:  dcos package describe
title: dcos package describe
menuWeight: 0
excerpt: Fetching details for a package

enterprise: false
---


# Description
The `dcos package describe` command allows you to view specific details for packages.

# Usage

```bash
dcos package describe <package-name> [OPTION]
```

# Options

| Name, shorthand |  Description |
|---------|-------------|
| `--app`   |   Application only. |
| `--cli`   |   Command line only. |
| `--config`   |  Displays the configurable properties of the `marathon.json` file. |
| `--options=<file>`   |  Path to a JSON file that contains customized package installation options. |
| `--package-versions`   |  Displays all versions for this package. |
| `--package-version=<package-version>`   |  The package version. |
| `--render`   |   Collate the `marathon.json` package template with values from the `config.json` and `--options`. If not provided, Displays the raw templates. |

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<package-name>`   |   Name of the DC/OS package. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos package](/1.13/cli/command-reference/dcos-package/)   | Install and manage DC/OS software packages. |
