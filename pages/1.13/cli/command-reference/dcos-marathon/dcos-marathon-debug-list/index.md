---
layout: layout.pug
navigationTitle:  dcos marathon debug list
title: dcos marathon debug list
menuWeight: 12
excerpt: Displaying the current queue of Marathon app deployments
enterprise: false
render: mustache
model: /1.13/data.yml
---



# Description
The `dcos marathon debug list` command allows you to display a list of currently queued instance launches for debugging purpose.

# Usage

```bash
dcos marathon debug list [--json]
```

# Options

| Name |  Description |
|---------|-------------|
| `-h`, `--help` | Display info about usage of this command. |
| `--json`   |  Displays JSON-formatted data. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.13/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

