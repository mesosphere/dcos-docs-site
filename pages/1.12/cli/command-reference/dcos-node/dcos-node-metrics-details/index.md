---
layout: layout.pug
navigationTitle:  dcos node metrics details
title: dcos node metrics details
menuWeight: 10
excerpt: Displaying the details of Mesos agent nodes
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
| `--json`   |   Displays JSON-formatted data. |

# Positional arguments

| Name |  Description |
|---------|-------------|
| `<mesos-id>` | ID number of agent node.

