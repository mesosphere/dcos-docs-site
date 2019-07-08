---
layout: layout.pug
navigationTitle:  dcos package repo add
title: dcos package repo add
menuWeight: 3
excerpt: Adding a package repository to DC/OS
render: mustache
model: /1.14/data.yml
enterprise: false
---

# Description
The `dcos package repo add` command allows you to add a package repository to DC/OS.

# Usage

```bash
dcos package repo add <repo-name> <repo-url> [--index=<index>]
```

# Options

| Name | Description |
|---------|-------------|
| `-h`, `--help` | Display usage. |
| `--index=<index>`   | The numerical position in the package repository list. Package repositories are searched in descending order. By default, the {{ model.packageRepo }} repository first in the list. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<repo-name>`   |   Name of the package repository. For example, `{{ model.packageRepo }}`. |
| `<repo-url>`   |   URL of the package repository. For example, https://universe.mesosphere.com/repo. |


# Examples

For an example, see the [documentation](/1.14/administering-clusters/repo/).

# Parent command

| Command | Description |
|---------|-------------|
| [dcos package](/1.14/cli/command-reference/dcos-package/)   | Install and manage DC/OS software packages. |
