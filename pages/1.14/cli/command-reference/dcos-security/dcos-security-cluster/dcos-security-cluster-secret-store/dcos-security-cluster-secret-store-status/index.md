---
layout: layout.pug
navigationTitle:  dcos security cluster secret-store status
title: dcos security cluster secret-store status
menuWeight: 105
excerpt: Managing the DC/OS Certificate Authority
enterprise: true
---

# Description

The `dcos security cluster secret-store status` command will display information about a given backend.

# Usage

```
dcos security cluster secret-store status [OPTIONS] STORE_ID
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
| [dcos security cluster secret-store](/1.13/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-secret-store/) | Display settings for your secret store. |
