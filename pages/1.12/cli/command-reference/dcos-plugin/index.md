---
layout: layout.pug
navigationTitle:  dcos plugin
title: dcos plugin
menuWeight: 12
excerpt: Installing and managing DC/OS CLI plugins

enterprise: false
---

# Description

The `dcos plugin` command allows you to install and manage DC/OS CLI plugins. Unlike `dcos package`, `dcos plugin` is only used to manage CLI plugins locally on your computer and will have no effect on the cluster.

# Usage

```bash
dcos plugin
```

# Options

| Name | Default | Description |
|-----------------|---------|-------------|
| `--help, h`     |         |  Print usage. |

# Usage

```
dcos plugin
Manage CLI plugins

Usage:
  dcos plugin [command]

Commands:
  add
      Add a CLI plugin
  list
      List CLI plugins
  remove
      Remove a CLI plugin

Options:
  -h, --help   help for plugin

Use "dcos plugin [command] --help" for more information about a command.
```
