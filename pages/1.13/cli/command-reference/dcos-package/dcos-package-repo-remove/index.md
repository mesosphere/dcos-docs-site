---
layout: layout.pug
navigationTitle:  dcos package repo remove
title: dcos package repo remove
menuWeight: 9
excerpt: Removing a package repository from DC/OS
render: mustache
model: /1.13/data.yml
enterprise: false
---


# Description
The `dcos package repo remove` command allows you to remove a package repository from DC/OS.

# Usage

```bash
dcos package repo remove <repo-names>...
```

# Options

| Name |  Description |
|---------|-------------|
| `-h`, `--help` | Display usage. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<repo-name>`   |   Name of the package repository. For example, `{{ model.packageRepo }}`. |



# Examples

For an example, see the [documentation](/1.13/administering-clusters/repo/).

# Parent command

| Command | Description |
|---------|-------------|
| [dcos package](/1.13/cli/command-reference/dcos-package/)   | Install and manage DC/OS software packages. |
