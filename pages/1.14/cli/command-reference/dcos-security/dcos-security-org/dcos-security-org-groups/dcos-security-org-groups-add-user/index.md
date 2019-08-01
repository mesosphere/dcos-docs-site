---
layout: layout.pug
navigationTitle:  dcos security org groups add_user
title: dcos security org groups add_user
menuWeight: 125
excerpt: Adding a user to a group
render: mustache
model: /mesosphere/dcos/1.14/data.yml
enterprise: true
---
# Description

The `dcos security org groups add_user` command allows you to add users to a specified user group.

# Usage

```
dcos security org groups add_user [OPTIONS] GID UID
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
| [dcos security cluster org groups](/mesosphere/dcos/1.14/cli/command-reference/dcos-security/dcos-security-org/dcos-security-org-groups/) |  Manage user groups and group membership. |
