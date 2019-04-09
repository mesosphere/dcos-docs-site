---
layout: layout.pug
navigationTitle:  dcos node decommission
excerpt: Decommissioning a DC/OS node
title: dcos node decommission
menuWeight: 1
---

# Description

The `dcos node decommission` command allows you to mark an agent as gone.

# Usage

```bash
dcos node decommission <mesos-id>
```

# Options

| Name |  Description |
|---------|-------------|
| `--help, h`   |   Displays usage. |
| `--mesos-id=<mesos-id>` | The agent ID of a node. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos node](/1.12/cli/command-reference/dcos-node/) | View DC/OS node information. |
