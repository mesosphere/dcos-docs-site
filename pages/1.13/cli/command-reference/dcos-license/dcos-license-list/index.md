---
layout: layout.pug
navigationTitle:  dcos license list
title: dcos license list
menuWeight: 2
excerpt: Displaying the cluster licenses

enterprise: true
---

# Description
The `dcos license list` command will display all the cluster licenses.

# Usage

```bash
dcos license list --output <file_path>
```

# Options

| Name, shorthand |  Description |
|---------|-------------|
| `--output`   |   Store the license in a file. |


# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<file_path>`    |  The path to a file to store the license. |


# Parent command

| Command | Description |
|---------|-------------|
| [dcos license](/1.13/cli/command-reference/dcos-license/) | Manage DC/OS cluster licenses. |

# Examples
For examples, see [Licenses](/1.13/administering-clusters/licenses/).
