---
layout: layout.pug
navigationTitle:  dcos node log
title: dcos node log
menuWeight: 9
excerpt: Displaying Mesos logs for nodes

enterprise: false
---


# Description
The `dcos node log` command displays the Mesos logs for the leading master node, agent nodes, or both.

# Usage

```bash
dcos node log [--follow --lines=N --leader --mesos-id=<mesos-id>]  [--component=<component-name> --filter=<filter>...]
```

# Options

| Name | Default | Description |
|---------|-------------|-------------|
| `--help, h`   |   |   Displays usage. |
| `--leader`   |             |  The leading master. |
| `--follow`   |             |  Dynamically update the log. |
| `--lines=N`   |     10      |  Displays the last N lines. |
| `--mesos-id=<mesos-id>`   |             | The agent ID of a node. |
| `--component=<component-name>` |    |    Show DC/OS component logs.|
| `--filter=<filter>`  |     |  Filter logs by field and value. Filter must be a string separated by colon. For example: `--filter _PID:0 --filter _UID:1`.|

# Parent command

| Command | Description |
|---------|-------------|
| [dcos node](/1.13/cli/command-reference/dcos-node/) | View DC/OS node information. |
