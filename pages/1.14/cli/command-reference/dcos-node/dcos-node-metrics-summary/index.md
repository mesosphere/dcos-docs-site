---
layout: layout.pug
navigationTitle:  dcos node metrics summary
title: dcos node metrics summary
menuWeight: 11
excerpt: Summarizing the details of Mesos agent nodes
enterprise: false
---

# Description

The `dcos node metrics summary` command prints CPU, memory and disk metrics for the agent node specified by <mesos-id>.

# Usage

```
dcos node metrics summary <mesos-id> [--json]
```

# Options

| Name |  Description |
|---------|-------------|
| `--help, h`   |   Displays usage. |
| `--json`   |   Displays JSON-formatted data. |
| `<mesos-id>` | ID number of agent node. |


# Parent command

| Command | Description |
|---------|-------------|
| [dcos node](/1.13/cli/command-reference/dcos-node/) | View DC/OS node information. |

