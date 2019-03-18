---
layout: layout.pug
navigationTitle:  dcos marathon debug details
title: dcos marathon debug details
menuWeight: 11
excerpt: Displaying debugging information for Marathon applications

enterprise: false
---


# Description
The `dcos marathon app debug details` command allows you to view debugging information for Marathon application deployments that are waiting.

# Usage

```bash
dcos marathon debug details <app-id> [OPTION]
```

# Options

| Name, shorthand |  Description |
|---------|-------------|
| `--json`   |  Displays JSON-formatted data. |

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<app-id>`   |   The application ID.  You can view a list of the application IDs with the `dcos marathon app list` command. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.13/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |


