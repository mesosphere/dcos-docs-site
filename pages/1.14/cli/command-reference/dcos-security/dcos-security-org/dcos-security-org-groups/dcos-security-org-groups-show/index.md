---
layout: layout.pug
navigationTitle:  dcos security org groups show
title: dcos security org groups show
menuWeight: 155
excerpt: Viewing information about a group
render: mustache
model: /1.14/data.yml
enterprise: true
---

# Description

The `dcos security org groups show` command will display basic information about a group or groups.

# Usage

```
dcos security org groups show [OPTIONS] [GIDS]...
```

# Options

| Name |  Description |
|---------|-------------|
|  `-h`, `--help` |  Show this message and exit.|
| `-j`, `--json` | Output data in JSON format. |

## Positional Arguments

| Name |  Description |
|---------|-------------|
| `GID` | Group ID. (Required)|

# Parent command

| Command | Description |
|---------|-------------|
| [dcos security cluster org groups](/1.14/cli/command-reference/dcos-security/dcos-security-org/dcos-security-org-groups/) |  Manage user groups and group membership. |
