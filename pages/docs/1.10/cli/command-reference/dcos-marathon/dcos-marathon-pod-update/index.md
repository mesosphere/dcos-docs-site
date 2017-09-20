---
layout: layout.pug
title: dcos marathon pod update
menuWeight: 28
excerpt:
featureMaturity:
enterprise: false
navigationTitle:  dcos marathon pod update
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


# Description
Update a pod.

# Usage

```bash
dcos marathon pod update <pod-id> [OPTION]
```

# Options

| Name, shorthand | Default | Description |
navigationTitle:  dcos marathon pod update
|---------|-------------|-------------|
| `--force`   |             | Disable checks in Marathon during updates. |

# Positional arguments

| Name, shorthand | Default | Description |
navigationTitle:  dcos marathon pod update
|---------|-------------|-------------|
| `<pod-id>`   |             | The pod ID. |

# Parent command

| Command | Description |
navigationTitle:  dcos marathon pod update
|---------|-------------|
| [dcos marathon](/docs/1.10/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

# Examples

# Update Pod
To update a pod, first modify the JSON definition for the pod, then run the following command: 

```
dcos marathon pod update <pod-id> < <new-pod-definition>
```

If the pod is currently deploying, you will not be able to update the pod. To update the pod anyway, run the command with the `--force` flag.
