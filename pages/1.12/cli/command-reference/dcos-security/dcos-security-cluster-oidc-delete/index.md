---
layout: layout.pug
navigationTitle:  dcos security cluster oidc delete
title: dcos security cluster oidc delete
menuWeight: 50
excerpt: Deleting an OIDC provider configuration
enterprise: true
---

# Description

The `dcos security cluster oidc delete` command allows you to delete an OpenID Connect provider configuration.

# Options

| Name | Description |
|---------|-----------------|
| `-h`, `--help` |  Show this message and exit.|
| `OIDC_ID` | ID of OIDC configuration. |

```
Usage: dcos security cluster oidc delete [OPTIONS] OIDC_ID

  Delete an OIDC provider configuration.

Options:
  -h, --help  Show this message and exit.
```