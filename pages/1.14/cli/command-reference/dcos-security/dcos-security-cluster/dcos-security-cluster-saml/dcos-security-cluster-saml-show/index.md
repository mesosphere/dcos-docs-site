---
layout: layout.pug
navigationTitle:  dcos security cluster saml show
title: dcos security cluster saml show
menuWeight: 85
excerpt: Viewing an existing SAML provider configuration
render: mustache
model: /1.14/data.yml
enterprise: true
---

# Description

The `dcos security cluster saml show` command presents an overview of the configured SAML providers. It will display detailed information about a given provider or an overview depending  on whether a provider ID was specified or not.

If multiple providers are specified, only the first ID is evaluated.

# Usage

```
dcos security cluster saml show [OPTIONS] [SAML_ID]...
```

# Options

| Name | Description |
|-----------------|-----------------|
|  `-h`, `--help` |   Show this message and exit. |
|  `-j`, `--json` |   Output data in JSON format. |

## Positional Arguments

| Name | Description |
|--------|------------------|
| `SAML_ID` | ID of SAML provider. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos security cluster saml](/1.14/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-saml//) | Manage your Security Assertion Markup Language (SAML) settings. |


/1.14/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-saml/
