---
layout: layout.pug
navigationTitle:  dcos marathon debug summary
title: dcos marathon debug summary
menuWeight: 13
excerpt: Display the debugging queue of waiting Marathon app deployments
enterprise: false
render: mustache
model: /1.14/data.yml
---


# Description
The `dcos marathon debug summary` command displays summarized information for a queued instance launch for debugging purpose..

# Usage

```bash
dcos marathon debug summary <app-id> [--json]
```

# Options

| Name |  Description |
|---------|-------------|
| `-h`, `--help` | Display info about usage of this command. |
| `--json`   |  Displays JSON-formatted data. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<app-id>`   |  The application ID.  You can view a list of the application IDs with the `dcos marathon app list` command. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/mesosphere/dcos/1.14/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

