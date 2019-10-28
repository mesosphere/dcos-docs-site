---
layout: layout.pug
navigationTitle:  dcos task
title: dcos task
menuWeight: 16
excerpt: Managing DC/OS tasks
render: mustache
model: /mesosphere/dcos/2.0/data.yml
enterprise: false
---

# Description

The `dcos task` commands let you manage DC/OS tasks.

**This command is deprecated since DC/OS 2.0; use `dcos task list` instead.**

# Usage

```bash
dcos task [OPTIONS]
```

# Options

| Name |  Description |
|---------|-------------|
| `-h`, `--help`  |    Print usage. |
| `--agent-id`  |    Only list the tasks for a specified agent. |
| `--info` |  Print a short description of this subcommand.|
| `--version` |  Print version information.|

# Commands

