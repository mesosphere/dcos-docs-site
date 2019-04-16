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
dcos package uninstall <package-name> [--cli | [--app [--app-id=<app-id> | --all] --yes]]
```

# Options

| Name | Description |
|---------|-------------|
| `-h`, `--help` | Display usage. |
| `--all`   |  All applications. |
| `--app`   |  Application only. |
| `--app-id=<app-id>`   |   The application ID. |
| `--cli`   |   Command line only. |
| `--yes` | Disable interactive mode and assume "yes" is the answer to all prompts.|

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<package-name>`   |   Name of the DC/OS package. |


# Examples

For an example, see the [documentation](/1.13/deploying-services/uninstall/).


# Parent command

| Command | Description |
|---------|-------------|
| [dcos package](/1.13/cli/command-reference/dcos-package/)   | Install and manage DC/OS software packages. |
