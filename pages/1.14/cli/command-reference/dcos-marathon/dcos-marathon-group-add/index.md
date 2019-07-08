---
layout: layout.pug
navigationTitle:  dcos marathon group add
title: dcos marathon group add
menuWeight: 17
excerpt: Adding a Marathon group
enterprise: false
render: mustache
model: /1.14/data.yml
---


# Description

The `dcos marathon group add` command allows you to add a Marathon group.

# Usage

```bash
dcos marathon group add [<group-resource>]
```

# Options

| Name | Description |
|---------|-------------|
| `-h`, `--help` | Display info about usage of this command. |


## Positional arguments

| Name |  Description |
|---------|-------------|
| `<group-resource>`   | Path to a file or HTTP(S) URL that contains the group's JSON definition. If omitted, the definition is read from `stdin`. For a detailed description see the [documentation](/1.14/deploying-services/marathon-api/). |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.14/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

