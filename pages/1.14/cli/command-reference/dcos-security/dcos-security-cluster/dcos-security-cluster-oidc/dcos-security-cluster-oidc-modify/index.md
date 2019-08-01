---
layout: layout.pug
navigationTitle:  cos security cluster oidc modify
title: cos security cluster oidc modify
menuWeight: 60
excerpt: Modifying an existing OIDC provider configuration
render: mustache
model: /1.14/data.yml
enterprise: true
---

# Description

The `cos security cluster oidc modify` command lets you modify an existing OIDC provider configuration.

# Usage

```
dcos security cluster oidc modify [OPTIONS] OIDC_ID
```

# Options


| Name | Description |
|--------------|-----------------|
|  ` -d`, `--description <text>` |    Description for the OIDC provider.  (Required)|
| `-i`, `--issuer <text>` |         Issuer of the OIDC provider.  (Required) |
|  `-b`, `--base-url <text>` |       Base URL of the OIDC provider.  (Required)|
|  `-c`, `--client-secret <text>` |  Client secret for the OIDC provider.  (Required)|
|  `--client-id <text>` |          Client ID of the new OIDC provider.  (Required) |
|  `-h`, `--help` |                Show this message and exit.|


## Positional Arguments

| Name | Description |
|--------|------------------|
| `OIDC_ID` | OpenID Connect provider ID. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos security cluster oidc](/mesosphere/dcos/1.14/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-oidc/) | Manage your OIDC settings. |
