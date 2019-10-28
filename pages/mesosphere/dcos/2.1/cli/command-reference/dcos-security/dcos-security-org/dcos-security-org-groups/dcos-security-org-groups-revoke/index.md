---
layout: layout.pug
navigationTitle:  dcos security org groups revoke
title: dcos security org groups revoke
menuWeight: 155
excerpt: Revoke permission for a group to act on a resource
render: mustache
model: /mesosphere/dcos/2.0/data.yml
enterprise: true
---
# Description

The `dcos security org groups revoke` command will revoke permission for the group with the given GID to enact a given ACTION on the resource with the given RID.

# Usage

```
dcos security org groups revoke [OPTIONS] GID RID ACTION
```

# Options

| Name |  Description |
|---------|-------------|
|  `-h`, `--help` |  Show this message and exit.|

## Positional Arguments

| Name |  Description |
|---------|-------------|
| `GID` | Group ID. (Required)|
| `RID` | Resource ID. (Required)|

# Parent command

| Command | Description |
|---------|-------------|
| [dcos security cluster org groups](/mesosphere/dcos/2.0/cli/command-reference/dcos-security/dcos-security-org/dcos-security-org-groups/) |  Manage user groups and group membership. |
