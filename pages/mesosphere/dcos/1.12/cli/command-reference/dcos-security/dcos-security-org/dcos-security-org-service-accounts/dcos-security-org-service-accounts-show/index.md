---
layout: layout.pug
navigationTitle:  dcos security org service-accounts show
title: dcos security org service-accounts show
menuWeight: 180
excerpt: Showing service account details
enterprise: true
---

# Description

The `dcos security org service-accounts show` command displays the details of a service account identified by its SID.

# Usage

```
dcos security org service-accounts show [OPTIONS] [SIDS]...
```

# Options

| Name |  Description |
|---------|-------------|
|  `-h`, `--help` |  Show this message and exit.|
| `-j`, `--j` | Output data in JSON format.|

## Positional Arguments

| Name |  Description |
|---------|-------------|
| `SID` | Service Account ID. (Required)|
