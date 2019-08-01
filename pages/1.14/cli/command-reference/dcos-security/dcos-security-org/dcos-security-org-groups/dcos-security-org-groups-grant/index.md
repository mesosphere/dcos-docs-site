---
layout: layout.pug
navigationTitle:  dcos security org groups grant
title: dcos security org groups grant
menuWeight: 143
excerpt: Granting permissions to a group
render: mustache
model: /1.14/data.yml
enterprise: true
---

# Description

The `dcos security org groups grant` command grants the group with the given GID permission to enact a given ACTION on the resource with the given RID.

# Usage

```
dcos security org groups grant [OPTIONS] GID RID ACTION
```

# Options

| Name |  Description |
|---------|-------------|
|  `-h`, `--help` |  Show this message and exit.|
| `--description` | TEXT. The description of the ACL with the given RID. If an ACL exists with the given RID then the description will not be overwritten. Default: "Created with the DC/OS Enterprise CLI".

## Positional Arguments

| Name |  Description |
|---------|-------------|
| `GID` | Group ID. (Required)|

# Parent command

| Command | Description |
|---------|-------------|
| [dcos security cluster org groups](/mesosphere/dcos/1.14/cli/command-reference/dcos-security/dcos-security-org/dcos-security-org-groups/) |  Manage user groups and group membership. |
