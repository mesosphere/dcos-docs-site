---
layout: layout.pug
navigationTitle:  dcos config unset
title: dcos config unset
menuWeight: 3
excerpt: Removing a property from the configuration file

enterprise: false
---


# Description
The `dcos config unset` command will remove a property from the configuration file.

# Usage

```bash
dcos config unset <name>
```



# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<name>`   |  The name of the property. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos config](/1.13/cli/command-reference/dcos-config/) |  Manage DC/OS configuration. |

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
