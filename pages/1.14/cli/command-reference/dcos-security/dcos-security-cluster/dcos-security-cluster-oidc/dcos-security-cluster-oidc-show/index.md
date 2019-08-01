---
layout: layout.pug
navigationTitle:  dcos security cluster oidc show
title: dcos security cluster oidc show
menuWeight: 65
excerpt: Viewing the DC/OS Certificate Authority information
render: mustache
model: /mesosphere/dcos/1.14/data.yml
enterprise: true
---

# Description

The `dcos security cluster oidc show` command gives you an overview of the configured OpenID Connect providers. It will display detailed information about a given provider or an overview, depending on whether a provider ID was specified or note.

If multiple providers are specified, only the first ID is evaluated.

# Usage

```
dcos security cluster oidc show [OPTIONS] [OIDC_ID]...
```

# Options

| Name | Description |
|----------------|-------------------|
|  `-h`, `--help` |  Show this message and exit.|
|  `-j`, `--json` | Output data in JSON format.|


## Positional Arguments

| Name | Description |
|--------|------------------|
| `OIDC_ID` | OpenID Connect provider ID. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos security cluster oidc](/mesosphere/dcos/1.14/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-oidc/) | Manage your OIDC settings. |
