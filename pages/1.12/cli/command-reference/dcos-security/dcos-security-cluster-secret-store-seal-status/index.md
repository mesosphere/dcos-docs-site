---
layout: layout.pug
navigationTitle:  dcos security cluster secret-store seal-status
title: dcos security cluster secret-store seal-status
menuWeight: 92
excerpt: Viewing the seal status of a secrets store
enterprise: true
---

# Description

The `dcos security cluster secret-store seal-status` command displays the seal status of a secrets store.

# Options

| Name |  Description |
|---------|-------------|
| `STORE_ID`  | ID of secret store. (Required)|
| `-j`, `--json` |  Output data in JSON format. |
|  `-h`, `--help` |  Show this message and exit.|




```
Usage: dcos security cluster secret-store seal-status [OPTIONS] STORE_ID

  Return the seal status of the store.

Options:
  -j, --json  Output data in JSON format.
  -h, --help  Show this message and exit.
```
