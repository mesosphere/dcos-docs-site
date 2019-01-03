---
layout: layout.pug
navigationTitle:  dcos marathon app update
title: dcos marathon app update
menuWeight: 9
excerpt: Updating an application

enterprise: false
---

# Description
The command `dcos marathon app update` allows you to update a specified application.

# Usage

```bash
dcos marathon app update <app-id> [OPTION]
```

# Options

| Name, shorthand |  Description |
|---------|-------------|
| `--force`   | Disable checks in Marathon during updates. |

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<app-id>`   |  The application ID.  You can view a list of the application IDs with the `dcos marathon app list` command. |
| `<properties>`   |  List of one or more JSON object properties, separated by a space. The list must be formatted as `<key>=<value>`. For example, `cpus=2.0 mem=308`. If omitted, properties are read from a JSON object provided on stdin. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.11/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |

# Examples

For examples, see the [documentation](/1.11/deploying-services/update-user-service/).
