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
dcos marathon app version list <app-id> [OPTION]
```

# Options

| Name, shorthand |  Description |
|---------|-------------|
| `--max-count=<max-count>`   | Maximum number of entries to fetch and return. |

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<app-id>`   |   The application ID. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.13/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |


