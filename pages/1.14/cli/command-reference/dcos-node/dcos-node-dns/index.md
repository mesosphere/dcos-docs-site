---
layout: layout.pug
navigationTitle:  dcos node dns
title: dcos node dns
menuWeight: 6
excerpt: Viewing DC/OS node information
render: mustache
model: /1.14/data.yml
enterprise: false
---

# Description

The `dcos node dns` command allows you to view your DC/OS cluster's domain name service configuration.

# Usage

```
dcos node dns <dns-name> [--json]
```

# Options

| Name |  Description |
|---------|-------------|
| `--help, h`   |   Displays usage. |
| `--json`   |   Displays JSON-formatted data. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<dns-name>` | DNS service name.|


# Parent command

| Command | Description |
|---------|-------------|
| [dcos node](/mesosphere/dcos/1.14/cli/command-reference/dcos-node/) | View DC/OS node information. |

