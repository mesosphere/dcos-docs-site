---
layout: layout.pug
navigationTitle:  dcos security org groups members
title: dcos security org groups members
menuWeight: 145
excerpt: Listing members of a group
render: mustache
model: /1.14/data.yml
enterprise: true
---
# Description

The `dcos security org groups members` command will list all the members in a group.

# Usage

```
dcos security org groups members [OPTIONS] GID
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
| [dcos security cluster org groups](/mesosphere/dcos/1.14/cli/command-reference/dcos-security/dcos-security-org/dcos-security-org-groups/) |  Manage user groups and group membership. |
