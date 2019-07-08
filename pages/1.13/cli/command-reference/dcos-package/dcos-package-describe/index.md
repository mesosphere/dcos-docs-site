---
layout: layout.pug
navigationTitle:  dcos package describe
title: dcos package describe
menuWeight: 0
render: mustache
model: /1.13/data.yml
excerpt: Fetching details for a package
enterprise: false
---


# Description
The `dcos package describe` command allows you to view specific details for packages.

# Usage

```bash
dcos package describe <package-name> --package-versions
```

# Options

| Name |  Description |
|---------|-------------|
| `-h`, `--help`   |   Show usage. |
| `--package-versions`   |  Displays all versions for this package. |


## Positional arguments

| Name |  Description |
|---------|-------------|
| `<package-name>`   |   Name of the DC/OS package. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos package](/1.13/cli/command-reference/dcos-package/)   | Install and manage DC/OS software packages. |
