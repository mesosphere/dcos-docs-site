---
layout: layout.pug
navigationTitle:  dcos marathon app start
title: dcos marathon app start
menuWeight: 7
excerpt: Starting an application
enterprise: false
render: mustache
model: /1.14/data.yml
---


# Description

The `dcos marathon app start` command allows you to start an application.

# Usage

```bash
dcos marathon app start [--force] <app-id> [<instances>]
```

# Options

| Name |  Description |
|---------|-------------|
| `--force`   |  Disable checks in Marathon during updates. |
| `-h`, `--help` | Display info about usage of this command. |


## Positional arguments

| Name |  Description |
|---------|-------------|
| `<app-id>`   |   The application ID.  You can view a list of the application IDs with the `dcos marathon app list` command.  |
| `--instances`   |  The number of instances. |


# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/mesosphere/dcos/1.14/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |


