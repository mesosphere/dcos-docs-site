---
layout: layout.pug
navigationTitle:  dcos package search
title: dcos package search
menuWeight: 6
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


# Description
Search the package repository.

# Usage

```bash
dcos package search <query> [OPTION]
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--json`   |             |  JSON-formatted data. |

# Positional arguments

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `<query>`   |             |  Pattern to use for searching the package repository.  You can use complete or partial values. |
        
# Parent command

| Command | Description |
|---------|-------------|
| [dcos package](/1.10/cli/command-reference/dcos-package/)   | Install and manage DC/OS software packages. |

# Examples

For an example, see the [documentation](/1.10/administering-clusters/repo/).
