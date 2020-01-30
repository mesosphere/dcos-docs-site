---
layout: layout.pug
navigationTitle:  dcos security cluster secret-store seal-status
title: dcos security cluster secret-store seal-status
menuWeight: 92
excerpt: Viewing the seal status of a secrets store
render: mustache
model: /mesosphere/dcos/2.0/data.yml
enterprise: true
---

# Description

The `dcos security cluster secret-store seal-status` command displays the seal status of a secrets store.

# Usage

```bash
dcos security cluster secret-store seal-status [OPTIONS] STORE_ID
```

# Options

| Name |  Description |
|---------|-------------|
| `-j`, `--json` |  Output data in JSON format. |
|  `-h`, `--help` |  Show this message and exit.|


## Positional Arguments

| Name |  Description |
|---------|-------------|
| `STORE_ID`  | ID of secret store. (Required)|

# Parent command

| Command | Description |
|---------|-------------|
| [dcos security cluster secret-store](/mesosphere/dcos/2.0/cli/command-reference/dcos-security/dcos-security-cluster/dcos-security-cluster-secret-store/) | Display settings for your secret store. |
