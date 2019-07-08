---
layout: layout.pug
navigationTitle:  dcos marathon pod add
title: dcos marathon pod add
menuWeight: 23
excerpt: Adding a pod
enterprise: false
render: mustache
model: /1.14/data.yml
---


# Description
The `dcos marathon pod add` command allows you to add a pod.

# Usage

```bash
dcos marathon pod add [<pod-resource>]
```

# Options

| Name |  Description |
|---------|-------------|
| `-h`, `--help` | Display info about usage of this command. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<pod-resource>`   |  Path to a file or HTTP(S) URL that contains the pod's JSON definition. If omitted, the definition is read from stdin. |


# Examples

## Add a Pod

To add a pod, first create a JSON pod definition. Then, run the following command:
```
dcos marathon pod add <pod-json-file>
```

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.14/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |
