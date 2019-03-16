---
layout: layout.pug
navigationTitle:  dcos license audit 
title: dcos license audit 
menuWeight: 0
excerpt: Getting the cluster license audit records

enterprise: true
---

# Description
The `dcos license audit` command allows you to retrieve audit data for your DC/OS licenses.

# Usage

```bash
dcos license audit get [<id>|active] [--output <file_path>] [--decrypt]
```

# Options

| Name |  Description |
|---------|-------------|
| `--output`   |  Store the audit records in a file. |
| `--decrypt`   |   Decrypt the license audit records checksum. |

# Commands

| Name | Description |
|---------------|--------------------|
| `get` | Retrieve the audit file associated with a specific license. |


# Positional arguments

| Name |  Description |
|---------|-------------|
| `<id> `   |  The ID of the license. |
| `active`   |   The active license. |
| `<file_path>`    |  The path to a file to store the audit records. |


# Parent command

| Command | Description |
|---------|-------------|
| [dcos license](/1.12/cli/command-reference/dcos-license/) | Manage DC/OS cluster licenses. |

# Examples
For examples, see [Licenses](/1.12/administering-clusters/licenses/).
