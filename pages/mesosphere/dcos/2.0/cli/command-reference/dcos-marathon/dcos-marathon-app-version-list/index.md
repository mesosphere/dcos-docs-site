---
layout: layout.pug
navigationTitle:  dcos marathon app version list
title: dcos marathon app version list
menuWeight: 10
excerpt: Displaying the version history of an application

enterprise: false
---


# Description

The `dcos marathon app version list` command allows you to list the version history of an application.

# Usage

```bash
dcos marathon app version list [--max-count=<max-count>] <app-id>
```

# Options

| Name |  Description |
|---------|-------------|
| `-h`, `--help` | Display info about usage of this command. |
| `--max-count=<max-count>`   | Maximum number of entries to fetch and return. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<app-id>`   |   The application ID. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/mesosphere/dcos/2.0/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |


