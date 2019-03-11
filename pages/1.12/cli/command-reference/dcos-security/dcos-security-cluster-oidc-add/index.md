---
layout: layout.pug
navigationTitle:  dcos security cluster oidc add
title: dcos security cluster oidc add
menuWeight: 13
excerpt: Configuring a new OpenID Connect provider
enterprise: true
---


# Description

The `dcos security cluster oidc add` command allows you to configure a new OpenID Connect provider.

# Options

| Name | Description |
|--------|------------------|
|  `-d`, `--description <text>` |    Description of the new OIDC provider.  (Required) | 
| `-i`, `--issuer <text>`  |  Issuer of the new OIDC provider.  (Required) | 
|  `-b`, `--base-url <text>` |       Base URL of the new OIDC provider.  (Required) | 
|  `-c`, `--client-secret <text>` |  Client secret for the new OIDC provider. (Required) | 
| `--client-id <text>` |          Client ID for the new OIDC provider.  (Required) | 
|  `-h`, `--help` |   Show this message and exit.|


# Usage

```
Usage: dcos security cluster oidc add [OPTIONS] OIDC_ID

  Configure a new OIDC provider.

Options:
  -d, --description <text>    Description of the new OIDC provider.  (Required) | 
  -i, --issuer <text>         Issuer of the new OIDC provider.  (Required) | 
  -b, --base-url <text>       Base URL of the new OIDC provider.  (Required) | 
  -c, --client-secret <text>  Client secret for the new OIDC provider.  (Required) | 
  --client-id <text>          Client ID for the new OIDC provider.  (Required) | 
  -h, --help                Show this message and exit.
```