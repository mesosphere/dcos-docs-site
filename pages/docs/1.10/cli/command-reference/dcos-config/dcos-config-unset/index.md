---
layout: layout.pug
title: dcos config unset
menuWeight: 3
excerpt:
featureMaturity:
enterprise: false
navigationTitle:  dcos config unset
---

<!-- This source repo for this topic is https://github.com/dcos/dcos-docs -->


# Description
Remove a property from the configuration file.

# Usage

```bash
dcos config unset <name> [OPTION]
```

# Options

None.

# Positional arguments

| Name, shorthand | Default | Description |
navigationTitle:  dcos config unset
|---------|-------------|-------------|
| `<name>`   |             |  The name of the property. |

# Parent command

| Command | Description |
navigationTitle:  dcos config unset
|---------|-------------|
| [dcos config](/docs/1.10/cli/command-reference/dcos-config/) |  Manage DC/OS configuration. |

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
