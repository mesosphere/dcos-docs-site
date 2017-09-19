---
layout: layout.pug
title: dcos marathon pod add
menuWeight: 23
excerpt:
featureMaturity:
enterprise: false
navigationTitle:  dcos marathon pod add
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


# Description
Add a pod.

# Usage

```bash
dcos marathon pod add <pod-resource> [OPTION]
```

# Options

None.

# Positional arguments

| Name, shorthand | Default | Description |
navigationTitle:  dcos marathon pod add
|---------|-------------|-------------|
| `<pod-resource>`   |             |  Path to a file or HTTP(S) URL that contains the pod's JSON definition. If omitted, the definition is read from stdin. |

# Parent command

| Command | Description |
navigationTitle:  dcos marathon pod add
|---------|-------------|
| [dcos marathon](/docs/1.10/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

# Examples

# Add a Pod

To add a pod, first create a JSON pod definition. Then, run the following command:
```
dcos marathon pod add <pod-json-file>
```
