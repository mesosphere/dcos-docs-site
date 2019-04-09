---
layout: layout.pug
navigationTitle:  dcos security cluster saml modify
title: dcos security cluster saml modify
menuWeight: 80
excerpt: Modifying an existing SAML provider configuration
enterprise: true
---

# Description

The `dcos security cluster saml modify` command allows you to modify an existing SAML provider configuration.


# Usage

```
dcos security cluster saml modify [OPTIONS] SAML_ID
```


# Options

| Name | Description |
|-----------------|-----------------|
|  `-d`, `--description <text>` |       A description of the SAML provider.  (Required) |
|  `-i`, `--idp-metadata <filename>` |  File containing IDP metadata in XML format.  (Required) |
|  `-b`, `--sp-base-url <text> ` |      The base URL for the service provider. (Required) |
|  `-h`, `--help` |   Show this message and exit. |

## Positional Arguments

| Name | Description |
|--------|------------------|
| `SAML_ID` | ID of SAML provider. |


# Parent command

| Command | Description |
|---------|-------------|
| [dcos security cluster saml](/1.12/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-saml//) | Manage your Security Assertion Markup Language (SAML) settings. |