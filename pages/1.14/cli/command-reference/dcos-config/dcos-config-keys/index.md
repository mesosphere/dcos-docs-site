---
layout: layout.pug
navigationTitle:  dcos config keys
title: dcos config keys
menuWeight: 1
excerpt: Retrieving the list of DC/OS configuration property keys
enterprise: false
render: mustache
model: /data.yml
---

# Description

The `dcos config keys` returns the list of configuration property keys that you can set in a DC/OS configuration file.

# Usage

```bash
dcos config keys [options]
```
# Options

| Name |  Description |
|---------|-------------|
| `--help, h`   |   Display usage. |
| `--quiet, q`   |   Only print configuration keys. |

<!--
# Permissions
To list the configuration keys for a cluster, your user account must have the following permissions:
-->
# Example
To retrieve the list of configuration property keys for a cluster, run the following command:

```bash
dcos config keys
```

# Parent command

| Command | Description |
|---------|-------------|
| [dcos config](/mesosphere/dcos/1.14/cli/command-reference/dcos-config/) |  Manage DC/OS configuration |
