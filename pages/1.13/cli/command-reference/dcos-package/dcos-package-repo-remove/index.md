---
layout: layout.pug
navigationTitle:  dcos package repo remove
title: dcos package repo remove
menuWeight: 5
excerpt: Removing a package repository from DC/OS

enterprise: false
---


# Description
The `dcos package repo remove` command allows you to remove a package repository from DC/OS.

# Usage

```bash
dcos package repo remove <repo-name> [OPTION]
```

# Options

| Name, shorthand |  Description |
|---------|-------------|
| `<repo-name>`   |   Name of the package repository. For example, `Universe`. |

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<repo-name>`   |   Name of the package repository. For example, `Universe`. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos package](/1.13/cli/command-reference/dcos-package/)   | Install and manage DC/OS software packages. |

# Examples

For an example, see the [documentation](/1.13/administering-clusters/repo/).
