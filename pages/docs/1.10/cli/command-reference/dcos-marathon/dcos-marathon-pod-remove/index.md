---
layout: layout.pug
title: dcos marathon pod remove
menuWeight: 26
excerpt: ""
featureMaturity: ""
enterprise: 'no'
navigationTitle:  dcos marathon pod remove
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


# Description
Remove a pod.

# Usage

```bash
dcos marathon pod remove <pod-id> [OPTION]
```

# Options

| Name, shorthand | Default | Description |
navigationTitle:  dcos marathon pod remove
|---------|-------------|-------------|
| `--force`   |             | Disable checks in Marathon during updates. |

# Positional arguments

| Name, shorthand | Default | Description |
navigationTitle:  dcos marathon pod remove
|---------|-------------|-------------|
| `<pod-id>`   |             | The pod ID. |

# Parent command

| Command | Description |
navigationTitle:  dcos marathon pod remove
|---------|-------------|
| [dcos marathon](/1.10/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

# Examples

# Remove a Pod
Remove a pod with the following command:
```
dcos marathon pod remove <pod-id>
```

If the pod is currently deploying, you will not be able to remove the pod. To remove the pod anyway, run the command with the `--force` flag.
