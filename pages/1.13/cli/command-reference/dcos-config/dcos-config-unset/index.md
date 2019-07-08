---
layout: layout.pug
navigationTitle:  dcos config unset
title: dcos config unset
menuWeight: 3
excerpt: Removing a property from the configuration file
enterprise: false
render: mustache
model: /1.13/data.yml
---


# Description
The `dcos config unset` command will remove a property from the configuration file used for the current cluster.

# Usage

```bash
dcos config unset <name> [flags]
```
# Options

| Name |  Description |
|---------|-------------|
| `--help, h`   |   Display usage. |



## Positional arguments

| Name |  Description |
|---------|-------------|
| `<name>`   |  The name of the property |



# Examples

## Remove a config value

In this example, the `core.ssl_verify` property is removed.

```bash
dcos config unset core.ssl_verify
```

Here is the output:

```bash
Removed [core.ssl_verify]
```
# Parent command

| Command | Description |
|---------|-------------|
| [dcos config](/1.13/cli/command-reference/dcos-config/) |  Manage DC/OS configuration |
