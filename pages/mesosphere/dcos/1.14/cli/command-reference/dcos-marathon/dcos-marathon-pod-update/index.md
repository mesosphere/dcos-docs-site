---
layout: layout.pug
navigationTitle:  dcos marathon pod update
title: dcos marathon pod update
menuWeight: 28
excerpt: Updating a Marathon pod
enterprise: false
render: mustache
model: /mesosphere/dcos/1.14/data.yml
---


# Description
The `dcos marathon pod update` command allows you to update a pod.

# Usage

```bash
dcos marathon pod update [--force] <pod-id>
```

# Options

| Name |  Description |
|---------|-------------|
| `-h`, `--help` | Display info about usage of this command. |
| `--force`   |   Disable checks in Marathon during updates. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<pod-id>`   |  The pod ID. You can view a list of the pod IDs with the `dcos marathon pod list` command.|



# Examples

## Update Pod
To update a pod, first modify the JSON definition for the pod, then run the following command:

```
dcos marathon pod update <pod-id> < <new-pod-definition>
```

If the pod is currently deploying, you will not be able to update the pod. To update the pod anyway, run the command with the `--force` flag.

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/mesosphere/dcos/1.14/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |
