---
layout: layout.pug
navigationTitle:  dcos plugin list
title: dcos plugin list
menuWeight: 2
excerpt: Displaying a list of the installed CLI plugins
render: mustache
model: /data.yml
enterprise: false
---


# Description

The `dcos plugin list` command will print a list of the installed CLI plugins.

# Usage

```bash
dcos plugin list [flags]
```

# Options

| Name |  Description |
|---------|------------|
| `--help, h`     |  Print usage. |
| `--json`   |   JSON-formatted list. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos plugin](/1.13/cli/command-reference/dcos-plugin/)   | Install and manage DC/OS software plugins. |
