---
layout: layout.pug
navigationTitle:  dcos marathon group scale
title: dcos marathon group scale
menuWeight: 20
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


# Description
Scale a group.

# Usage

```bash
dcos marathon group scale <group-id> <scale-factor> [OPTION]
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--force`   |             | Disable checks in Marathon during updates. |

# Positional arguments

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `<group-id>`   |             |  The group ID. |
| `<scale-factor>`   |             | The factor to scale an application group by. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.10/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

<!-- # Examples -->
