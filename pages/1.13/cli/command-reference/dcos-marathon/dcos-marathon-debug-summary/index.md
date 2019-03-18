---
layout: layout.pug
navigationTitle:  dcos marathon debug summary
title: dcos marathon debug summary
menuWeight: 13
excerpt: Display the debugging queue of waiting Marathon app deployments

enterprise: false
---


# Description
The dcos marathong debug summary command allows you to view the current queue and debugging information of Marathon application deployments that are waiting.

# Usage

```bash
dcos marathon debug summary <app-id> [OPTION]
```

# Options

| Name, shorthand |  Description |
|---------|-------------|
| `--json`   |  Displays JSON-formatted data. |

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<app-id>`   |  The application ID.  You can view a list of the application IDs with the `dcos marathon app list` command. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.13/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

