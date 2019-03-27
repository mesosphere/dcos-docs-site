---
layout: layout.pug
navigationTitle:  dcos security org groups create
title: dcos security org groups create
menuWeight: 130
excerpt: Creating a user group
enterprise: true
---
# Description
The `dcos security org groups create` command allows you to create a new group.

# Usage

```bash
dcos security org groups create [OPTIONS] GID
```

# Options

| Name |  Description |
|---------|-------------|
| `d`, `--description <text>` | Description of group.|
|  `-h`, `--help` |  Show this message and exit.|

## Positional Arguments

| Name |  Description |
|---------|-------------|
| `GID` | Group ID. (Required)|

# Parent command

| Command | Description |
|---------|-------------|
| [dcos security cluster org groups](/1.12/cli/command-reference/dcos-security/dcos-security-org/dcos-security-org-groups/) |  Manage user groups and group membership. |