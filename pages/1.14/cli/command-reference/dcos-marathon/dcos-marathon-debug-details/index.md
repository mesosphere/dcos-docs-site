---
layout: layout.pug
navigationTitle:  dcos marathon debug details
title: dcos marathon debug details
menuWeight: 11
excerpt: Displaying debugging information for Marathon applications
enterprise: false
---


# Description

The `dcos marathon app debug details` command displays detailed information for a queued instance launch for debugging purposes.

# Usage

```bash
dcos marathon debug details <app-id> [--json]
```

# Options

| Name |  Description |
|---------|-------------|
| `-h`, `--help` | Display info about usage of this command. |
| `--json`   |  Displays JSON-formatted data. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<app-id>`   |   The application ID.  You can view a list of the application IDs with the `dcos marathon app list` command. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.13/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |


