---
layout: layout.pug
navigationTitle:  dcos package search
title: dcos package search
menuWeight: 6
excerpt: Searching the package repository
render: mustache
model: /1.13/data.yml
enterprise: false
---

# Description
The `dcos package search` command allows you to search the package repository.

# Usage

```bash
dcos package search [<query> --json]
```

# Options

| Name | Description |
|---------|-------------|
| `-h`, `--help` | Display usage. |
| `--json`   | Display output as  JSON-formatted data. |

## Positional arguments

| Name | Description |
|---------|-------------|
| `<query>`   |   Pattern to use for searching the package repository.  You can use complete or partial values. |



# Examples

For an example, see the [documentation](/1.13/administering-clusters/repo/).

# Parent command

| Command | Description |
|---------|-------------|
| [dcos package](/1.13/cli/command-reference/dcos-package/)   | Install and manage DC/OS software packages. |
