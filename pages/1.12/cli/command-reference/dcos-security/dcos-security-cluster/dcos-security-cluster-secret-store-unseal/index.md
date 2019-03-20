---
layout: layout.pug
navigationTitle:  dcos security cluster secret-store unseal
title: dcos security cluster secret-store unseal
menuWeight: 115
excerpt: Unsealing a secret store
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
| `STORE_ID KEY`  | ID key of secret store. (Required) |
| `-j`, `--json` |  Output data in JSON format. |
|  `-h`, `--help` |  Show this message and exit.|

