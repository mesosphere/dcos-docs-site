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
| `--json`   |   Displays JSON-formatted data. |

# Positional arguments

| Name |  Description |
|---------|-------------|
| `<mesos-id>` | ID number of agent node.

