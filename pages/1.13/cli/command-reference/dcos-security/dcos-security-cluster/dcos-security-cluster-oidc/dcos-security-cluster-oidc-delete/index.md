---
layout: layout.pug
navigationTitle:  dcos security cluster oidc delete
title: dcos security cluster oidc delete
menuWeight: 50
excerpt: Deleting an OIDC provider configuration
render: mustache
model: /data.yml
enterprise: true
---

# Description

The `dcos security cluster oidc delete` command allows you to delete an OpenID Connect provider configuration.

# Usage

```
dcos security cluster oidc delete [OPTIONS] OIDC_ID
```

# Options

| Name | Description |
|---------|-----------------|
| `-h`, `--help` |  Show this message and exit.|


## Positional Arguments

| Name | Description |
|--------|------------------|
| `OIDC_ID` | OpenID Connect provider ID. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos security cluster oidc](/1.13/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-oidc/) | Manage your OIDC settings. |
