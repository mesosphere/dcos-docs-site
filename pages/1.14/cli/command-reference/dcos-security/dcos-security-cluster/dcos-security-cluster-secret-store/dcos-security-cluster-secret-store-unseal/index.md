---
layout: layout.pug
navigationTitle:  dcos security cluster secret-store unseal
title: dcos security cluster secret-store unseal
menuWeight: 115
excerpt: Unsealing a secret store
render: mustache
model: /mesosphere/dcos/1.14/data.yml
enterprise: true
---
# Description

The `dcos security cluster secret-store unseal` command allows you to unseal a given store.

# Usage

```
dcos security cluster secret-store unseal [OPTIONS] STORE_ID KEY
```

# Options

| Name |  Description |
|---------|-------------|
| `-j`, `--json` |  Output data in JSON format. |
|  `-h`, `--help` |  Show this message and exit.|

## Positional Arguments

| Name |  Description |
|---------|-------------|
| `STORE_ID`  | ID of secret store. |

# Parent command

| Command | Description |
|---------|-------------|
| [dcos security cluster secret-store](/mesosphere/dcos/1.14/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-secret-store/) | Display settings for your secret store. |
