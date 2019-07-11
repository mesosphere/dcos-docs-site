---
layout: layout.pug
navigationTitle:  dcos task list
title: dcos task list
menuWeight: 2
excerpt: List the tasks inside of a cluster
render: mustache
model: /1.14/data.yml
enterprise: false
---

# Description

The `dcos task list` commands lists the DC/OS tasks in the cluster.

# Usage

```bash
dcos task list [OPTIONS]
```

# Options

| Name |  Description |
|---------|-------------|
| `-h`, `--help`  |    Print usage. |
| `--agent-id`  |    Only list the tasks for a specified agent. |
| `--info` |  Print a short description of this subcommand.|
| `--version` |  Print version information.|

# Commands

