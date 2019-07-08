---
layout: layout.pug
navigationTitle:  dcos marathon app update
title: dcos marathon app update
menuWeight: 9
excerpt: Updating an application
render: mustache
model: /1.13/data.yml
enterprise: false
render: mustache
model: /1.13/data.yml
---

# Description

The command `dcos marathon app update` allows you to update a specified application.

# Usage

```bash
dcos marathon app update [--force] <app-id> [<properties>...]
```

# Options

| Name |  Description |
|---------|-------------|
| `-h`, `--help` | Display info about usage of this command. |
| `--force`   | Disable checks in Marathon during updates. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<app-id>`   |  The application ID.  You can view a list of the application IDs with the `dcos marathon app list` command. |
| `<properties>`   |  List of one or more JSON object properties, separated by a space. The list must be formatted as `<key>=<value>`. For example, `cpus=2.0 mem=308`. If omitted, properties are read from a JSON object provided on `stdin`. |



# Examples

For examples, see the [documentation](/1.13/deploying-services/update-user-service/).

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.13/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |
