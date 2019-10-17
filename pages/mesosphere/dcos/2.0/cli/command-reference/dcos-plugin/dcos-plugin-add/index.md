---
layout: layout.pug
navigationTitle:  dcos plugin add
title: dcos plugin add
menuWeight: 1
excerpt: Adding a CLI plugin
render: mustache
model: /mesosphere/dcos/1.14/data.yml
enterprise: false
---


# Description

The `dcos plugin add` command allows you to add a CLI plugin.

# Usage

```bash
dcos plugin add <resource> [flags]
```

# Options

| Name |  Description |
|---------|-------------|
| `--update`, `-u`     | The plugin version. |
| `--help, h`     | Print usage. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<resource>`   |   Path to the plugin resource. This can be either a `.zip` file or a URL |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos plugin](/mesosphere/dcos/1.14/cli/command-reference/dcos-plugin/)   | Install and manage DC/OS software plugins. |
