---
layout: layout.pug
navigationTitle:  dcos license audit get
title: dcos license audit get
menuWeight: 0
excerpt: Getting the cluster license audit records

enterprise: true
---

# Description
Get the cluster license audit records.

# Usage

```bash
dcos license audit get [<id>|active] [--output <file_path>] [--decrypt]
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--output`   |             |  Store the audit records in a file. |
| `--decrypt`   |             |  Decrypt the license audit records checksum. |


# Positional arguments

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `<id> `   |             |  The ID of the license. |
| `active`   |             |  The active license. |
| `<file_path>`    |   |  The path to a file to store the audit records. |




# Parent command

| Command | Description |
|---------|-------------|
| [dcos license](/1.12/cli/command-reference/dcos-license/) | Manage DC/OS cluster licenses. |

# Examples
For examples, see [Licenses](/1.12/administering-clusters/licenses/).
