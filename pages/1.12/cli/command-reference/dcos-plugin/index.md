---
layout: layout.pug
navigationTitle:  dcos plugin
title: dcos plugin
menuWeight: 12
excerpt: Installing and managing DC/OS CLI plugins

enterprise: false
---

# Description

Install and manage DC/OS CLI plugins. Unlike `dcos package`, `dcos plugin` is only used to manage CLI plugins locally on your computer and will have no effect on the cluster.

# Usage

```bash
dcos plugin
```

# Options

| Name, shorthand | Default | Description |
|-----------------|---------|-------------|
| `--help, h`     |         |  Print usage. |


# Child commands

| Command | Description |
|---------|-------------|
| [dcos plugin add](/1.12/cli/command-reference/dcos-plugin/dcos-plugin-add/) | Install a CLI plugin |
| [dcos plugin list](/1.12/cli/command-reference/dcos-plugin/dcos-plugin-list/) | List installed plugins |
| [dcos plugin remove](/1.12/cli/command-reference/dcos-plugin/dcos-plugin-remove/) | Remove a CLI plugin |
