---
layout: layout.pug
navigationTitle:  dcos license status
title: dcos license status
menuWeight: 4
excerpt: Reviewing the cluster license status

enterprise: true
---

# Description
The `dcos license status` command retrieves the active license terms and breach information. By default, the command outputs to `stdout`.

# Usage

```bash
dcos license status [OPTIONS]
```

# Options

| Name |  Description |
|---------|-------------|
| `--terms`   |   Filter the status to only print the active license terms. |
| `--breaches`   |   Filter the status to only print the active license breaches. |
| `--help`   |   Show this message and exit. |


# Examples

```json
dcos license status
{
  "current_timestamp": "2019-03-26T02:44:29.055698601Z",
  "end_timestamp": "2019-06-01T15:04:05Z",
  "id": "mesosphere-developer",
  "node_capacity": 300,
  "number_of_breaches": 0,
  "number_of_nodes": 1,
  "start_timestamp": "2018-12-01T15:04:05Z"
}

```
```
dcos license status --breaches
0
```
For more examples, see [Licenses](/1.13/administering-clusters/licenses/).


# Parent command

| Command | Description |
|---------|-------------|
| [dcos license](/1.13/cli/command-reference/dcos-license/) | Manage DC/OS cluster licenses. |
