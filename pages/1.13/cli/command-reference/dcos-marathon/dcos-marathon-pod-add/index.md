---
layout: layout.pug
navigationTitle:  dcos marathon pod add
title: dcos marathon pod add
menuWeight: 23
excerpt: Adding a pod

enterprise: false
---


# Description
The `dcos marathon pod add` command allows you to add a pod.

# Usage

```bash
dcos marathon pod add <pod-resource> [OPTION]
```

# Options

None.

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<pod-resource>`   |  Path to a file or HTTP(S) URL that contains the pod's JSON definition. If omitted, the definition is read from stdin. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.13/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

# Examples

## Add a Pod

To add a pod, first create a JSON pod definition. Then, run the following command:
```
dcos marathon pod add <pod-json-file>
```
