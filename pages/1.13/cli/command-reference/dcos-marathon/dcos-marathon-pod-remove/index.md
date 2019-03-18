---
layout: layout.pug
navigationTitle:  dcos marathon pod remove
title: dcos marathon pod remove
menuWeight: 26
excerpt: Removing a pod

enterprise: false
---


# Description
The `dcos marathon pod remove` command allows you to remove a pod.

# Usage

```bash
dcos marathon pod remove <pod-id> [OPTION]
```

# Options

| Name, shorthand |  Description |
|---------|-------------|
| `--force`   |  Disable checks in Marathon during updates. |

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<pod-id>`   |  The pod ID. You can view a list of the pod IDs with the `dcos marathon pod list` command.|

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.13/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

# Examples

## Remove a Pod
Remove a pod with the following command:
```
dcos marathon pod remove <pod-id>
```

If the pod is currently deploying, you will not be able to remove the pod. To remove the pod anyway, run the command with the `--force` flag.
