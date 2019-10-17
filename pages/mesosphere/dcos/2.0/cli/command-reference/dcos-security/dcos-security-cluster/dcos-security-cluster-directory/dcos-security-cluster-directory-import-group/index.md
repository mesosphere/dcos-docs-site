---
layout: layout.pug
navigationTitle:  dcos security cluster directory import_group
title: dcos security cluster directory import_group
menuWeight: 33
excerpt: Importing an LDAP group
render: mustache
model: /mesosphere/dcos/1.14/data.yml
enterprise: true
---

# Description

The `dcos security cluster directory import_group` command imports a group of users from the configured directory (LDAP) backend. See IAM documentation for details on group import.

# Usage

```
dcos security cluster directory import_user [OPTIONS] GID
```

# Options

| Name | Description |
|--------|-------------------|
| `-h`, `--help` |  Show this message and exit.|

## Positional Arguments

| Name | Description |
|--------|-------------------|
| `GID` | Group ID. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos security cluster directory](/mesosphere/dcos/1.14/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-directory/) | Manage LDAP settings. |
