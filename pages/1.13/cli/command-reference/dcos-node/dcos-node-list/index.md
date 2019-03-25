---
layout: layout.pug
navigationTitle:  dcos node list
excerpt: Show all nodes in the cluster
title: dcos node list
menuWeight: 1
---


# Description
The `dcos node list` commands allow you to show all nodes in the cluster.
This command shows the hostname, private IP, public IP(s), Mesos ID, type,
region, and zone of each node.

# Usage

```bash
dcos node list [OPTION]
```

# Options

| Name, shorthand |  Description |
|---------|-------------|
| `--help, h`   |   Displays usage. |
| `--info`   |  Displays a short description of this subcommand. |
| `--json`   |    Displays JSON-formatted data. |
| `--version, v`   |  Displays version information. |
