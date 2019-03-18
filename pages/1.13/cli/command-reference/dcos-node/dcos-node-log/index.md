---
layout: layout.pug
navigationTitle:  dcos node log
title: dcos node log
menuWeight: 5
excerpt: Displaying Mesos logs for nodes

enterprise: false
---


# Description
The `dcos node log` command displays the Mesos logs for the leading master node, agent nodes, or both.

# Usage

```bash
dcos node log [OPTION]
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--leader`   |             |  The leading master. |
| `--follow`   |             |  Dynamically update the log. |
| `--lines=N`   |     10      |  Displays the last N lines. |
| `--master`   |             |  This option is deprecated and is replaced by `--leader`. |
| `--mesos-id=<mesos-id>`   |             | The agent ID of a node. |
| `--slave=<agent-id>`   |             | This option is deprecated and is replaced by `--mesos-id`. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos node](/1.13/cli/command-reference/dcos-node/) | View DC/OS node information. |
