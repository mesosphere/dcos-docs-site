---
layout: layout.pug
navigationTitle:  dcos security cluster directory import_user
title: dcos security cluster directory import_user
menuWeight: 35
excerpt: Importing a user from an LDAP backend
render: mustache
model: /mesosphere/dcos/2.0/data.yml
enterprise: true
---
# Description

The `dcos security cluster directory import_user` command imports a user from the configured directory (LDAP) backend.


# Usage

```bash
dcos security cluster directory import_user [OPTIONS] UID
```


# Options

| Name | Description |
|----------|---------|
| `-h`, `--help` |  Show this message and exit.|

## Positional Arguments

| Name | Description |
|--------|-------------------|
| `UID` | User ID. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos security cluster directory](/mesosphere/dcos/2.0/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-directory/) | Manage LDAP settings. |
