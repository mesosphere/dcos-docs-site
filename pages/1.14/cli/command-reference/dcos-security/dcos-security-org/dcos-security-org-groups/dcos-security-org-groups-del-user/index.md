---
layout: layout.pug
navigationTitle:  dcos security org groups del_user
title: dcos security org groups del_user
menuWeight: 135
excerpt: Deleting a user from a group
render: mustache
model: /1.14/data.yml
enterprise: true
---
# Description

The `dcos security org groups del_user` command allows you to delete a user from a group.

# Usage

```
dcos security org groups del_user [OPTIONS] GID UID
```

# Options

| Name |  Description |
|---------|-------------|
|  `-h`, `--help` |  Show this message and exit.|

## Positional Arguments

| Name |  Description |
|---------|-------------|
| `GID` | Group ID. (Required)|
| `UID` | User ID. (Required)|

# Parent command

| Command | Description |
|---------|-------------|
| [dcos security cluster org groups](/1.14/cli/command-reference/dcos-security/dcos-security-org/dcos-security-org-groups/) |  Manage user groups and group membership. |
