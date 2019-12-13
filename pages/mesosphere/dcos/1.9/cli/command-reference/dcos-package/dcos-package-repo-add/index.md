---
layout: layout.pug
navigationTitle:  dcos package repo add
title: dcos package repo add
menuWeight: 3
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


# Description
Add a package repository to DC/OS.

# Usage

```bash
dcos package repo add <repo-name> <repo-url> [OPTION]
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--index=<index>`   |             | The numerical position in the package repository list. Package repositories are searched in descending order. By default, the Universe repository first in the list. |

# Positional arguments

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `<repo-name>`   |             |  Name of the package repository. For example, `Universe`. |
| `<repo-url>`   |             |  URL of the package repository. For example, https://universe.mesosphere.com/repo. |
        
# Parent command

| Command | Description |
|---------|-------------|
| [dcos package](/mesosphere/dcos/1.9/cli/command-reference/dcos-package/)   | Install and manage DC/OS software packages. |

# Examples

For an example, see the [documentation](/mesosphere/dcos/1.9/administering-clusters/repo/).
