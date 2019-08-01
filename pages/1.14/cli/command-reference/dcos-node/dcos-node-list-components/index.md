---
layout: layout.pug
navigationTitle:  dcos node list-components
title: dcos node list-components
menuWeight: 7
excerpt: Displaying the available DC/OS components on a specified node
render: mustache
model: /1.14/data.yml
enterprise: false
---


# Description
The `dcos node list-components` command displays a list of available DC/OS components on specified node.

# Usage

```bash
dcos node list-components [--leader --mesos-id=<mesos-id> --json]
```

# Options

| Name |  Description |
|---------|-------------|
| `--help, h`   |   Displays usage. |
| `--json`   | Displays JSON-formatted data. |
| `--leader`   |  The leading master. |
| `--mesos-id=<mesos-id>`   |  The agent ID of a node. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos node](/mesosphere/dcos/1.14/cli/command-reference/dcos-node/) | View DC/OS node information. |


