---
layout: layout.pug
navigationTitle:  dcos node metrics details
title: dcos node metrics details
menuWeight: 10
excerpt: Displaying the details of Mesos agent nodes
render: mustache
model: /1.14/data.yml
enterprise: false
---

# Description

The `dcos node metrics details` command prints a table of all metrics for the agent node specified by <mesos-id>.

# Usage

```
dcos node metrics details <mesos-id>  [--json]
```

# Options

| Name |  Description |
|---------|-------------|
| `--help, h`   |   Displays usage. |
| `--json`   |   Displays JSON-formatted data. |
| `--mesos-id=<mesos-id>` |    The agent ID of a node. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos node](/mesosphere/dcos/1.14/cli/command-reference/dcos-node/) | View DC/OS node information. |


