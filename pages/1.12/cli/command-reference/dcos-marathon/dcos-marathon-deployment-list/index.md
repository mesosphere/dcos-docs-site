---
layout: layout.pug
navigationTitle:  dcos marathon deployment list
title: dcos marathon deployment list
menuWeight: 14
excerpt: Displaying a list of currently deployed applications

enterprise: false
---


# Description

The `dcos marathon deployment list` command displays a list of currently deployed applications.

# Usage

```bash
dcos marathon deployment list [--json|--quiet] [<app-id>]
```

# Options

| Name |  Description |
|---------|-------------|
| `--json`   |  Displays JSON-formatted data. |
| `-q`, `--quiet` | Display IDs only for list. |
| `-h`, `--help` | Display info about usage of this command. |

## Positional arguments

| Name |  Description |
|---------|-------------|
| `<app-id>`   |   The application ID.  |




# Example

```bash
dcos marathon deployment list
APP          POD  ACTION  PROGRESS  ID                                    
/kubernetes  -    scale     1/2     e913f8a4-530c-438c-9f6e-709af1730c84  
```

# Parent command

| Command | Description |
|---------|-------------|
| [dcos marathon](/1.12/cli/command-reference/dcos-marathon/) | Deploy and manage applications to DC/OS. |