---
layout: layout.pug
navigationTitle:  dcos security secrets create-sa-secret
title: dcos security secrets create-sa-secret
menuWeight: 305
excerpt: Creating and storing a secret
render: mustache
model: /1.14/data.yml
enterprise: true
---

# Description

The `dcos security secrets create-sa-secret` command allows you to create a service account secret, or create one that can be used by services running on top of DC/OS to log in to a service account.

# Usage

```
dcos security secrets create-sa-secret [OPTIONS] SA_PRIVATE_KEY SA_UID SECRET_PATH
```

# Options

| Name |  Description |
|---------|-------------|
| `-s`,` --store-id <text>` | Secrets backend to use.|
|  `--strict `    |        Enforce secure cluster communication.|
|  `-h`, `--help`    |       Show this message and exit.|

## Positional Arguments

| Name |  Description |
|---------|-------------|
|  `SA_PRIVATE_KEY` | Private key that belongs to service account. |
|  `SA_UID` | Service account user ID. |
|  `SECRET_PATH` | Secret path allows you to restrict which services can retrieve the value. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos security secrets](/1.14/cli/command-reference/dcos-security/dcos-security-secrets/) |  Manage your secrets. |
