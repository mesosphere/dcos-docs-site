---
layout: layout.pug
navigationTitle:  dcos package install
title: dcos package install
menuWeight: 1
excerpt: Installing a package
render: mustache
model: /mesosphere/dcos/2.0/data.yml
enterprise: false
---


# Description
The `dcos package install` command allows you to install a package.

# Usage

```bash
dcos package install <package-name> [(--cli [--global]) | --app] [--package-version=<package-version>] [--options=<file>] [--yes]
```

# Options

| Name |  Description |
|---------|-------------|
| `-h`, `--help` | Display usage. |
| `--app`   |    Application only. |
| `--app-id=<app-id>`   |   The application ID. |
| `--cli`   |   Command line only. |
| `--global`  |  Install a subcommand for all configured clusters.  |
| `--options=<file>`   |  Path to a JSON file that contains customized package installation options. |
| `--package-version=<package-version>`   |  The package version. |
| `--yes`   |  Disable interactive mode and assume "yes" is the answer to all prompts. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<package-name>`   |   Name of the DC/OS package. |



# Examples

For an example, see the [documentation](/mesosphere/dcos/2.0/deploying-services/config-universe-service/).

# Parent command

| Command | Description |
|---------|-------------|
| [dcos package](/mesosphere/dcos/2.0/cli/command-reference/dcos-package/)   | Install and manage DC/OS software packages. |
