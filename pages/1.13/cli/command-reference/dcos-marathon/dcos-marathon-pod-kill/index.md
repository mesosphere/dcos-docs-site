---
layout: layout.pug
navigationTitle:  dcos marathon pod kill
title: dcos marathon pod kill
menuWeight: 24
excerpt: Stopping one or more running pod instances
enterprise: false
---

# Description
The `dcos marathon pod kill` command allows you to kill one or more running pod instances.

# Usage

```bash
dcos marathon pod kill <pod-id> [<instance-ids>...]
```
# Options

| Name |  Description |
|---------|-------------|
| `-h`, `--help` | Display info about usage of this command. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<instance-ids>`   |  List of one or more pod instance IDs, separated by a space. |
| `<pod-id>`   |  The pod ID. You can view a list of the pod IDs with the `dcos marathon pod list` command.|

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.13/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

