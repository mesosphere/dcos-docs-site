---
layout: layout.pug
navigationTitle:  dcos license get
title: dcos license get
menuWeight: 1
excerpt: Displaying the cluster licenses

enterprise: true
---

# Description
The `dcos license get` command allows you to view the cluster licenses.

# Usage

```bash
dcos license get [<id>|active] [--output <file_path>] [--decryption-key]
```

# Options

| Name, shorthand |  Description |
|---------|-------------|
|   |   |
| `--output`   |   Store the license in a file. |
| `--decryption-key`   |  Get the key to decrypt license audit records. |


# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<id> `   |   The ID of the license. |
| `active`   |   The active license. |
| `<file_path>`    |  The path to a file to store the license |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos license](/1.13/cli/command-reference/dcos-license/) | Manage DC/OS cluster licenses. |

# Examples
For examples, see [Licenses](/1.13/administering-clusters/licenses/).
