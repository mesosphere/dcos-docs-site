---
layout: layout.pug
navigationTitle:  dcos plugin add
title: dcos plugin add
menuWeight: 1
excerpt: Installing a plugin
enterprise: false
---


# Description

The `dcos plugin add` command allows you to install a plugin.

# Usage

```bash
dcos plugin install <resource> [OPTION]
```

# Options

| Name | Default | Description |
|---------|-------------|-------------|
| `--update, u    | `-u`            | The plugin version. |

# Positional arguments

| Name | Default | Description |
|---------|-------------|-------------|
| `<resource>`   |             |  Path to the plugin resource. This can be either a `.zip` file or a URL |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos plugin](/1.12/cli/command-reference/dcos-plugin/)   | Install and manage DC/OS software plugins. |
