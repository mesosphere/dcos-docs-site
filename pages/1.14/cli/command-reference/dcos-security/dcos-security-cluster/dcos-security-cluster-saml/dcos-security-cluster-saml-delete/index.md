---
layout: layout.pug
navigationTitle:  dcos security cluster saml delete
title: dcos security cluster saml delete
menuWeight: 13
excerpt: Deleting a SAML provider configuration
render: mustache
model: /mesosphere/dcos/1.14/data.yml
enterprise: true
---

# Description

The `dcos security cluster saml delete` command allows you to delete a SAML provider configuration.

# Usage

```
dcos security cluster saml delete [OPTIONS] SAML_ID
```


# Options

| Name | Description |
|-------------------|------------------|
| `-h`, `--help` |  Show this message and exit.|


## Positional Arguments

| Name | Description |
|--------|------------------|
| `SAML_ID` | ID of SAML provider. |


# Parent command

| Command | Description |
|---------|-------------|
| [dcos security cluster saml](/mesosphere/dcos/1.14/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-saml//) | Manage your Security Assertion Markup Language (SAML) settings. |
