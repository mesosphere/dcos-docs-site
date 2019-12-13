---
layout: layout.pug
navigationTitle:  dcos marathon app kill
title: dcos marathon app kill
menuWeight: 2
excerpt: Killing an active application instance
enterprise: false
render: mustache
model: /mesosphere/dcos/2.0/data.yml
---


# Description

The `dcos marathon app kill` command allows you to kill a running application instance.

# Usage

```bash
dcos marathon app kill [--scale] [--host=<host>] <app-id>
```

# Options

| Name |  Description |
|---------|-------------|
| `--help`   |  Show this message and exit. |
| `--host=<host>`   | The hostname that is running app. |
| `--scale`   |  Scale the app down after performing the operation.  |

# Positional arguments

| Name |  Description |
|---------|-------------|
| `<app-id>`   |   The application ID. You can view a list of the application IDs with the `dcos marathon app list` command. |



# Example

```bash
dcos marathon app kill kafka
Killed tasks: []
```

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/mesosphere/dcos/2.0/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |
