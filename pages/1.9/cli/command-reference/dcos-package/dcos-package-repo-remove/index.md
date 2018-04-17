---
layout: layout.pug
navigationTitle:  dcos package repo remove
title: dcos package repo remove
menuWeight: 5
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


# Description
Remove a package repository from DC/OS.

# Usage

```bash
dcos package repo remove <repo-name> [OPTION]
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `<repo-name>`   |             |  Name of the package repository. For example, `Universe`. |

# Positional arguments

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `<repo-name>`   |             |  Name of the package repository. For example, `Universe`. |
        
# Parent command

| Command | Description |
|---------|-------------|
| [dcos package](/1.9/cli/command-reference/dcos-package/)   | Install and manage DC/OS software packages. |

# Examples

For an example, see the [documentation](/1.9/administering-clusters/repo/).
