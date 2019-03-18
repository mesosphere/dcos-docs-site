---
layout: layout.pug
navigationTitle:  dcos node list-components
title: dcos node list-components
menuWeight: 4
excerpt: Displaying the available DC/OS components on a specified node

enterprise: false
---


# Description
The `dcos node list-components` command displays a list of available DC/OS components on specified node.

# Usage

```bash
dcos node list-components [OPTION]
```

# Options

| Name, shorthand |  Description |
|---------|-------------|
| `--json`   | Displays JSON-formatted data. |
| `--leader`   |  The leading master. |
| `--mesos-id=<mesos-id>`   |  The agent ID of a node. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos node](/1.13/cli/command-reference/dcos-node/) | View DC/OS node information. |


