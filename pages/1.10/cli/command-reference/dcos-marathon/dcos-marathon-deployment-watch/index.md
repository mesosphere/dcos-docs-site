---
layout: layout.pug
navigationTitle:  dcos marathon deployment watch
title: dcos marathon deployment watch
menuWeight: 16
excerpt:

enterprise: false
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


# Description
Monitor deployments.

# Usage

```bash
dcos marathon deployment watch <deployment-id> [OPTION]
```

# Options

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `--interval=<interval>`   |             | Number of seconds to wait between actions. |
| `--max-count=<max-count>`   |             | Maximum number of entries to fetch and return. |


# Positional arguments

| Name, shorthand | Default | Description |
|---------|-------------|-------------|
| `<deployment-id>`   |             |  The deployment ID. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.10/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

<!-- # Examples -->
