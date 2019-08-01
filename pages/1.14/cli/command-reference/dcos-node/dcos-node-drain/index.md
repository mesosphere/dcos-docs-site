---
layout: layout.pug
navigationTitle:  dcos node drain
title: dcos node drain
menuWeight: 6
excerpt: Draining an agent so that its tasks get rescheduled
render: mustache
model: /mesosphere/dcos/1.14/data.yml
enterprise: false
---

# Description

The `dcos node drain` command allows you to drain a Mesos agent so that its tasks get rescheduled.

# Usage

```
dcos node drain <mesos-id>
```

# Options

| Name |  Description |
|---------|-------------|
| `--decommission`   |   Decommission the agent after having drained it. |
| `--help, h`   |   Displays usage. |
| `--timeout`   |   Timeout to do the request. |
| `--wait`   |   Wait until the draining is done. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<mesos-id>` | The agent ID of a node.|

# Parent command

| Command | Description |
|---------|-------------|
| [dcos node](/mesosphere/dcos/1.14/cli/command-reference/dcos-node/) | View DC/OS node information. |

