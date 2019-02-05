---
layout: layout.pug
navigationTitle:  dcos marathon app show
title: dcos marathon app show
menuWeight: 6
excerpt: Viewing applications running on DC/OS

enterprise: false
---

# Description
The dcos marathon app show command allows you to view the details of applications running on DC/OS.

# Usage

```bash
dcos marathon app show <app-id> [OPTION]
```

# Options

| Name, shorthand |  Description |
|---------|-------------|
| `--app-version=<app-version>`   |  The version of the application to use. It can be specified as an absolute or relative value. Absolute values must be in ISO8601 date format. Relative values must be specified as a negative integer and they represent the version from the currently deployed application definition. |

# Positional arguments

| Name, shorthand |  Description |
|---------|-------------|
| `<app-id>`   |   The application ID.  You can view a list of the application IDs with the `dcos marathon app list` command. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.13/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |


