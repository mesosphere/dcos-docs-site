---
layout: layout.pug
navigationTitle:  dcos security org service-accounts delete
title: dcos security org service-accounts delete
menuWeight: 170
excerpt: Deleting a service account
render: mustache
model: /mesosphere/dcos/2.0/data.yml
enterprise: true
---

# Description

The `dcos security org service-accounts delete` command allows you to delete a service account identified by a Service Account ID (SID).

# Usage

```
dcos security org service-accounts delete [OPTIONS] SID
```

# Options

| Name |  Description |
|---------|-------------|
|  `-h`, `--help` |  Show this message and exit.|

## Positional Arguments

| Name |  Description |
|---------|-------------|
| `SID` | Service account ID. (Required)|
