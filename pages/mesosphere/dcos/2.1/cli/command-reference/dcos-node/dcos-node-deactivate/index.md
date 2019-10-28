---
layout: layout.pug
navigationTitle:  dcos node deactivate
excerpt: Deactivating a DC/OS node
title: dcos node deactivate
menuWeight: 1
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---

# Description

The `dcos node deactivate` command allows you to deactivate a Mesos agent.

# Usage

```bash
dcos node deactivate <mesos-id>
```

# Options

| Name |  Description |
|---------|-------------|
| `--help, h`   |   Displays usage. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<mesos-id>` | The agent ID of a node.|

# Parent command

| Command | Description |
|---------|-------------|
| [dcos node](/mesosphere/dcos/2.0/cli/command-reference/dcos-node/) | View DC/OS node information. |
