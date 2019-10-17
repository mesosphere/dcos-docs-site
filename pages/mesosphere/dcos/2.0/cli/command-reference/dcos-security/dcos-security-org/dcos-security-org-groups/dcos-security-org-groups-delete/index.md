---
layout: layout.pug
navigationTitle:  dcos security org groups delete
title: dcos security org groups delete
menuWeight: 140
excerpt: Deleting a group
render: mustache
model: /mesosphere/dcos/2.0/data.yml
enterprise: true
---
# Description

The `dcos security org groups delete` command allows you to remove a group.

# Usage

```
dcos security org groups delete [OPTIONS] GID
```

# Options

| Name |  Description |
|---------|-------------|
|  `-h`, `--help` |  Show this message and exit.|

## Positional Arguments

| Name |  Description |
|---------|-------------|
| `GID` | Group ID. (Required)|

# Parent command

| Command | Description |
|---------|-------------|
| [dcos security cluster org groups](/mesosphere/dcos/2.0/cli/command-reference/dcos-security/dcos-security-org/dcos-security-org-groups/) |  Manage user groups and group membership. |
