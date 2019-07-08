---
layout: layout.pug
navigationTitle:  dcos security cluster saml add
title: dcos security cluster saml add
menuWeight: 70
excerpt: Configuring a new SAML provider
render: mustache
model: /1.13/data.yml
enterprise: true
---
# Description

The `dcos security cluster saml add` command lets you configure a new SAML provider.

# Usage

```
dcos security cluster saml add [OPTIONS] SAML_ID
```

# Options

| Name | Description |
|-------------|-----------------|
| `-d`, `--description <text>` |  A description of the SAML provider.  (Required) |
| `-i`, `--idp-metadata <filename>` |  File containing IDP metadata in XML format. (Required) |
|  `-b`, `--sp-base-url <text>`  |  The base URL for the service provider. (Required) |
|  `-h`, `--help` | Show this message and exit.|

## Positional Arguments

| Name | Description |
|--------|------------------|
| `SAML_ID` | ID of SAML provider. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos security cluster saml](/1.13/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-saml//) | Manage your Security Assertion Markup Language (SAML) settings. |
